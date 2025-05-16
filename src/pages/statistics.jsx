import s from "../css/statistics.module.css";
import { useAsyncError, useNavigate } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function Statistics() {
    const navigate = useNavigate();

    //Charts
    const [viewType, setViewType] = useState("expense")
    const [chType, setChType] = useState('daily')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [chData, setChData] = useState([])

    //Transactions
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [endDate, setEndDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const days = 5;
    const [dates, setDates] = useState([]);
    const [more, setMore] = useState(true);

    //Transaction Motify
    const [selected, setSelected] = useState(null)
    const [openDelete, setOpenDelete] = useState(false)

    const [categories, setCategories] = useState([])
    const [accounts, setAccounts] = useState([])

    const fetchChartData = async () => {
        const parms = new URLSearchParams()
        if (fromDate) {
            parms.append('from', fromDate)
        }
        if (toDate) {
            parms.append('to', toDate)
        }
        parms.append('type', viewType)
        parms.append('view', chType)

        const rs = await fetch(
            `https://fintrack-api-kwxq.onrender.com/api/statistic?${parms}`
        ).then((x) => x.json());

        setChData(rs)
    }

    useEffect(() => {
        fetchChartData()
    }, [toDate, fromDate, viewType, chType])

    useEffect(() => {
        setFromDate('')
        setToDate('')
    }, [chType])

    const fetchCategories = async () => {
        const rs = await fetch(
            `https://fintrack-api-kwxq.onrender.com/api/categories`
        ).then((x) => x.json());

        setCategories(rs)
    };

    const fetchAccounts = async () => {
        const rs = await fetch(
            `https://fintrack-api-kwxq.onrender.com/api/accounts`
        ).then((x) => x.json());

        setAccounts(rs)
    };

    const MotifyTransaction = async () => {
        await fetch(`https://fintrack-api-kwxq.onrender.com/api/transactions/${selected.id}`,
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
        await fetch(`https://fintrack-api-kwxq.onrender.com/api/transactions/${selected.id}`, {
            method: "DELETE",
        });

        setSelected(null);
        setOpenDelete(false);

        fetchTransactions();
        setTransactions(prev => prev.filter(x => x.id != selected.id))
    };

    function addDate(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d.toISOString().split("T")[0];
    }

    const fetchTransactions = async () => {
        const rs = await fetch(
            `https://fintrack-api-kwxq.onrender.com/api/transactions/filter?endDate=${endDate}&days=${days}&type=${viewType}`
        ).then((x) => x.json())

        setLoading(false);

        setTransactions((prev) => {
            const merged = [...prev, ...rs.transactions];
            const unique = Array.from(
                new Map(merged.map((tx) => [tx.id, tx])).values()
            );

            if (rs.uniqueDates.length > 0) {
                setDates(Array.from(new Set([...dates, ...rs.uniqueDates])));
                setEndDate(addDate(rs.uniqueDates[rs.uniqueDates.length - 1], -1));
            }

            setMore(unique.length < rs.totalDataLength);

            return unique;
        });
    };

    useEffect(() => {
        fetchCategories()
        fetchAccounts()
        fetchTransactions();
    }, [viewType]);

    function ChangeType() {
        setEndDate(new Date().toISOString().split("T")[0])
        setDates([])
        setTransactions([])
        setViewType((prev) => (prev === "expense" ? "income" : "expense"));
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const { date, name, amount } = payload[0].payload;
            return (
                <div style={{ background: '#fff', border: '1px solid #ccc', padding: '8px' }}>
                    <p>{name}</p>
                    <p style={{ color: '#0055FF' }}>Date: {date}</p>
                    <p style={{ color: '#0055FF' }}>Amount: {amount}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className={s.screen}>
                <div className={s.top}>
                    <div className={s.heading}>
                        <h1>Statistics</h1>
                    </div>
                </div>
                <div className={s.body}>
                    <ul className={s.type}>
                        <li onClick={ChangeType} className={viewType == "expense" ? s.selected : ""}>Expense</li>
                        <li onClick={ChangeType} className={viewType == "income" ? s.selected : ""}>Income</li>
                    </ul>

                    <div className={s.content}>
                        <div className={s.aly}>
                            <ul className={s.options}>
                                <li onClick={() => setChType('daily')} className={chType === 'daily' ? s.selected : ''}>Daily</li>
                                <li onClick={() => setChType('monthly')} className={chType === 'monthly' ? s.selected : ''}>Monthly</li>
                                <li onClick={() => setChType('yearly')} className={chType === 'yearly' ? s.selected : ''}>Yearly</li>
                            </ul>
                            <div className={s.chart}>
                                <div className={s.dateInputs}>
                                    <div>
                                        <p>From :</p>
                                        <input type={chType == 'daily' ? 'date' : 'month'} value={fromDate} onChange={e => setFromDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <p>To :</p>
                                        <input type={chType == 'daily' ? 'date' : 'month'} value={toDate} onChange={e => setToDate(e.target.value)} />
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar
                                                dataKey="amount"
                                                fill="#0055FF"
                                                radius={[10, 10, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

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
                            {more && (
                                <p className={s.seeMore} onClick={fetchTransactions}>
                                    See More
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className={s.buttom}>
                    <ul className={s.nav}>
                        <li onClick={() => navigate("/home")}>
                            <i className={s.bi + " bi-house-door"}></i>
                            <span>Home</span>
                        </li>
                        <li>
                            <i className={s.bi + " bi-bar-chart-fill"}></i>
                            <span style={{ fontWeight: 600 }}>Statistics</span>
                        </li>
                        <li onClick={() => navigate("/upload/statistics")}>
                            <i className={s.bi + " bi-plus-circle-fill"} id={s.plus}></i>
                        </li>
                        <li onClick={() => navigate("/accounts")}>
                            <i className={s.bi + " bi-briefcase"}></i>
                            <span>Accounts</span>
                        </li>
                        <li>
                            <i className={s.bi + " bi-person"}></i>
                            <span>Profile</span>
                        </li>
                    </ul>
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
                                            <option key={account.id} value={account.id}>{account.name}</option>
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
                                                key={category.id}
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
        </>
    );
}

export default Statistics;
