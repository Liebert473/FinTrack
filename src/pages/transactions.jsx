import s from "../css/transactions.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { useFetchAuth } from "../components/fetchAuth";

function Transactions() {
    const navigate = useNavigate();
    const API_BASE = 'https://fintrack-api-easr.onrender.com'

    const fetchAuth = useFetchAuth()

    //Filter
    const [openFilter, setOpenFilter] = useState(false)
    const [minAmount, setMinAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(0)
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [type, setType] = useState("")
    const [account, setAccount] = useState("")
    const [Fcategory, setFCategory] = useState("")

    //Transaction Motify
    const [selected, setSelected] = useState(null)
    const [openDelete, setOpenDelete] = useState(false)

    //Transactions
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dates, setDates] = useState([]);

    const [categories, setCategories] = useState([])
    const [accounts, setAccounts] = useState([])

    const fetchCategories = async () => {
        const rs = await fetchAuth(
            `${API_BASE}/api/categories`
        )

        setCategories(rs)
    };

    const fetchAccounts = async () => {
        const rs = await fetchAuth(
            `${API_BASE}/api/accounts`
        )

        setAccounts(rs)
    };

    const fetchTransactions = async () => {
        const prams = new URLSearchParams()
        if (maxAmount != 0) {
            prams.append('maxAmount', maxAmount)
        }
        if (minAmount != 0) {
            prams.append('minAmount', minAmount)
        }
        if (type != "") {
            prams.append('type', type)
        }
        if (account != "") {
            prams.append('account', account)
        }
        if (Fcategory != '') {
            prams.append('category', Fcategory._id)
        }
        if (fromDate != "") {
            prams.append('fromDate', fromDate)
        }
        if (toDate != "") {
            prams.append('toDate', toDate)
        }

        const rs = await fetchAuth(
            `${API_BASE}/api/transactions/filter?${prams}`
        )

        setLoading(false)

        setTransactions(() => {
            setDates(rs.uniqueDates);

            return rs.transactions;
        });
    };

    const MotifyTransaction = async () => {
        await fetchAuth(`${API_BASE}/api/transactions/${selected._id}`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selected)
            }
        )

        fetchTransactions()
    }

    const DeleteTransaction = async () => {
        await fetchAuth(`${API_BASE}/api/transactions/${selected._id}`, {
            method: "DELETE",
        });

        setSelected(null);
        setOpenDelete(false);

        fetchTransactions();
        setTransactions(prev => prev.filter(x => x._id != selected._id))
    };

    const ResetFilter = async () => {
        setAccount("")
        setMinAmount(0)
        setMaxAmount(0)
        setToDate("")
        setFromDate("")
        setFCategory("")
        setType("")
    }

    useEffect(() => {
        fetchTransactions();
        fetchCategories()
        fetchAccounts()
    }, []);

    return (
        <>
            <div className={s.screen}>
                <div className={s.top}>
                    <span onClick={() => navigate("/home")} className={`${s.bi} bi-arrow-left-short`}></span>
                    <div className={s.heading}>
                        <h1>Transactions</h1>
                    </div>
                    <span onClick={() => setOpenFilter(true)} className={`${s.bi} bi-filter`}></span>
                </div>
                <div className={s.body}>
                    <div className={s.trans}>
                        {dates.map((date, index) => (
                            <Fragment key={date}>
                                <div className={s.date}>
                                    {date === new Date().toISOString().split("T")[0]
                                        ? "Today"
                                        : date}
                                </div>
                                {transactions
                                    .filter((x) => x.date === date)
                                    .map((t, tIndex) => (
                                        <div key={tIndex} className={s.transaction} onClick={() => setSelected(t)}>
                                            <p>{t.category.name}</p>
                                            <span className={t.type === "income" ? s.green : s.red}>
                                                {t.type === "income" ? "+" : "-"}
                                                {t.amount}
                                            </span>
                                        </div>
                                    ))}
                            </Fragment>
                        ))}
                        {loading && <p className={s.loading}>Loading...</p>}
                        {!loading && transactions.length === 0 && (
                            <p className={s.empty}>No transactions found</p>
                        )}
                    </div>
                </div>
            </div>

            {selected &&
                <div className={s.wrapper}>
                    <div className={s.window}>
                        <div className={s.close}>
                            <i onClick={() => setSelected(null)} className={`${s.bi} bi-x`}></i>
                        </div>
                        <form className={s["input-form"]} onSubmit={MotifyTransaction}>
                            <div className={s.input}>
                                <label htmlFor="type">Type</label>
                                <div className={s.select}>
                                    <select name="type" id="type" value={selected.type} onChange={e => setSelected(prev => ({ ...prev, type: e.target.value }))}>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="account">Account</label>
                                <div className={s.select}>
                                    <select name="account" id="account" value={selected.account} onChange={e => setSelected(prev => ({ ...prev, account: e.target.value }))}>
                                        {accounts.map((account) => (
                                            <option key={account._id} value={account._id}>{account.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="balance">Amount</label>
                                <div className={s["balance-input"]}>
                                    <span className={`${s.bi} bi-coin`}></span>
                                    <input id={s.balance} type="number" name="balance" value={selected.amount} onChange={e => setSelected(prev => ({ ...prev, amount: Number(e.target.value) }))} min={0.1} step="any" required />
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="date">Date</label>
                                <input type="date" name="date" id="date" value={selected.date} onChange={e => setSelected(prev => ({ ...prev, date: e.target.value }))} required />
                            </div>

                            <div className={s.input}>
                                <label htmlFor="category">Category</label>
                                <div className={s.select}>
                                    <select
                                        name="category"
                                        id="category"
                                        value={JSON.stringify(selected.category)}
                                        onChange={e =>
                                            setSelected(prev => ({
                                                ...prev,
                                                category: JSON.parse(e.target.value)
                                            }))
                                        }
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={JSON.stringify(category)}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={s.option} onClick={() => setOpenDelete(true)}>
                                <div>
                                    <i className={`${s.bi} bi-trash-fill`}></i>
                                    <p>Delete Transaction</p>
                                </div>
                                <i className={`${s.bi} bi-chevron-right`}></i>
                            </div>

                            <button type="submit" className={s.btn1}>Save</button>
                        </form>
                    </div>
                </div>}

            {openDelete &&
                <div className={s.wrapper}>
                    <div className={s["delete-transaction"]}>
                        <div className={s.close} onClick={() => setOpenDelete(false)}>
                            <i className={`${s.bi} bi-x`}></i>
                        </div>
                        <div className={s.content}>
                            <p>Are you sure you want to delete this transaction?</p>
                            <span>This action is irreversible. Once deleted, the transaction cannot be recovered.</span>
                            <button onClick={DeleteTransaction} className={s.btn1}>Delete</button>
                        </div>
                    </div>
                </div>
            }

            {openFilter &&
                <div className={s.wrapper}>
                    <div className={s.window}>
                        <div className={s.close} onClick={() => setOpenFilter(false)}>
                            <i className="bi bi-x"></i>
                        </div>
                        <form className={s["input-form"]} onSubmit={() => { fetchTransactions(); setOpenFilter(false); }}>
                            <div className={s.input}>
                                <label htmlFor="type">Type</label>
                                <div className={s.select}>
                                    <select name="type" id="type" value={type} onChange={e => setType(e.target.value)}>
                                        <option value="">All</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="account">Account</label>
                                <div className={s.select}>
                                    <select name="account" value={account} onChange={e => setAccount(e.target.value)}>
                                        <option value="">All</option>
                                        {accounts.map((account) => (
                                            <option key={account._id} value={account._id}>{account.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="balance">Amount</label>
                                <div className={s.inputG}>
                                    <p>Minimum :</p>
                                    <div className={s["balance-input"]}>
                                        <span className={`${s.bi} bi-coin`}></span>
                                        <input className={s.Balance} id="minBalance" type="number" name="minBalance" min={0} value={minAmount} onChange={(e) => setMinAmount(Number(e.target.value))} />
                                    </div>
                                </div>
                                <div className={s.inputG}>
                                    <p>Maximum :</p>
                                    <div className={s["balance-input"]}>
                                        <span className={`${s.bi} bi-coin`}></span>
                                        <input className={s.Balance} id="maxBalance" type="number" name="maxBalance" min={0} value={maxAmount} onChange={(e) => setMaxAmount(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="date">Date</label>
                                <div className={s.inputG}>
                                    <p>From :</p>
                                    <input type="date" name="fromDate" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                                </div>
                                <div className={s.inputG}>
                                    <p>To :</p>
                                    <input type="date" name="toDate" value={toDate} onChange={(e => setToDate(e.target.value))} />
                                </div>
                            </div>

                            <div className={s.input}>
                                <label htmlFor="category">Category</label>
                                <div className={s.select}>
                                    <select
                                        name="category"
                                        value={JSON.stringify(Fcategory)}
                                        onChange={e =>
                                            setFCategory(JSON.parse(e.target.value))
                                        }
                                    >
                                        <option value="">All</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={JSON.stringify(category)}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={s.bG}>
                                <button type="button" onClick={ResetFilter} className={s.btn2}>Reset</button>
                                <button type="submit" className={s.btn1}>Search</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
}

export default Transactions;
