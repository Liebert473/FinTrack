import { useState, useEffect } from "react";
import s from "../css/accounts.module.css";
import { useNavigate } from "react-router-dom";


function Accounts() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const navigate = useNavigate();
    const [add, setAdd] = useState(false);
    const [openAccount, setOpenAccount] = useState(false);
    const [moti_accountName, setMoti_accountName] = useState("");
    const [moti_accountBalance, setMoti_accountBalance] = useState("");
    const [moti_accountId, setMoti_accountId] = useState("");

    const [openDelete, setOpenDelete] = useState(false);

    const [accounts, setAccounts] = useState([]);

    const [accountName, setAccountName] = useState("");
    const [initBalance, setInitBalance] = useState(0);

    const OpenAccount = (id) => {
        setMoti_accountId(id);
        setOpenAccount(true);
        setMoti_accountName(accounts.find(account => account.id === id).name);
        setMoti_accountBalance(accounts.find(account => account.id === id).initialBalance);
    }

    const fetchAccounts = async () => {
        const rs = await fetch(
            `${API_BASE}/api/accounts`
        ).then((x) => x.json());

        setAccounts(rs)
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const MotifyAccount = async () => {
        await fetch(`${API_BASE}/api/accounts/${moti_accountId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: moti_accountName,
                initialBalance: Number(moti_accountBalance)
            })
        })
        setOpenAccount(false);
        fetchAccounts()
    }

    const addAccount = () => {
        if (accountName != '') {
            fetch(`${API_BASE}/api/accounts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: crypto.randomUUID(),
                    name: accountName,
                    initialBalance: Number(initBalance)
                })
            })
        }
    }

    const DeleteAccount = async () => {
        await fetch(`${API_BASE}/api/accounts/${moti_accountId}`, {
            method: "DELETE"
        })
        setOpenDelete(false);
        setOpenAccount(false);
        fetchAccounts()
    }

    return (
        <>
            <div className={s.screen}>
                <div className={s.top}>
                    {add && <span className={`${s.bi} bi-arrow-left-short`} onClick={() => setAdd(false)}></span>}
                    <div className={s.heading}>
                        <h1>{add ? 'Add account' : 'Accounts'}</h1>
                    </div>
                </div>
                <div className={s.body} style={add ? { display: "none" } : {}}>
                    <div className={s.accounts}>
                        {accounts.map((account) => (
                            <div className={s.account} key={account.id} onClick={() => OpenAccount(account.id)}>
                                <div className={s["a-top"]}>
                                    <p className={s.t}>{account.name}</p>
                                    <span>Total balance</span>
                                    <p>${account.totalBalance}</p>
                                </div>
                                <div className={s["a-body"]}>
                                    <div>
                                        <i className={`${s.bi} bi-arrow-down-circle-fill`}></i>
                                        <div>
                                            <span>Income</span>
                                            <p>${account.incomes}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <i className={`${s.bi} bi-arrow-up-circle-fill`}></i>
                                        <div>
                                            <span>Expense</span>
                                            <p>${account.expenses}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={s.btn1} onClick={() => setAdd(true)}>Add account</button>
                </div>
                <div className={s.buttom} style={add ? { display: "none" } : {}}>
                    <ul className={s.nav}>
                        <li onClick={() => navigate("/home")}>
                            <i className={`${s.bi} bi-house-door`}></i>
                            <span>Home</span>
                        </li>
                        <li onClick={() => navigate("/statistics")}>
                            <i className={`${s.bi} bi-bar-chart`}></i>
                            <span>Statistics</span>
                        </li>
                        <li onClick={() => navigate("/upload/accounts")}>
                            <i className={`${s.bi} bi-plus-circle-fill`} id={s.plus}></i>
                        </li>
                        <li>
                            <i className={`${s.bi} bi-briefcase-fill`}></i>
                            <span style={{ fontWeight: 600 }}>Accounts</span>
                        </li>
                        <li>
                            <i className={`${s.bi} bi-person`}></i>
                            <span>Profile</span>
                        </li>
                    </ul>
                </div>

                {add &&
                    <div className={s["add-account"]}>
                        <form action="" className={s["input-form"]} onSubmit={() => addAccount()}>
                            <div className={s.input}>
                                <label htmlFor="name">Account name</label>
                                <input type="text" name="name" required value={accountName} onChange={(e) => setAccountName(e.target.value)}></input>
                            </div>
                            <div className={s.input}>
                                <label htmlFor="balance">Initial balance</label>
                                <div className={s["balance-input"]}>
                                    <span className={`${s.bi} bi-coin`}></span>
                                    <input id={s.balance} type="number" name="balance" required value={initBalance} onChange={(e) => setInitBalance(e.target.value)}></input>
                                </div>
                            </div>
                            <button className={s.btn1} type="submit">Save</button>
                        </form>
                    </div>
                }

                {openAccount &&
                    <div className={s.wrapper}>
                        <div className={s["motify-account"]}>
                            <div className={s.close}>
                                <i className={`${s.bi} bi-x`} onClick={() => setOpenAccount(false)}></i>
                            </div>
                            <form onSubmit={MotifyAccount} className={s["input-form"]}>
                                <div className={s.input}>
                                    <label htmlFor="name">Account name</label>
                                    <input type="text" name="name" required value={moti_accountName} onChange={(e) => setMoti_accountName(e.target.value)}></input>
                                </div>
                                <div className={s.input}>
                                    <label htmlFor="balance">Initial Balance</label>
                                    <div className={s["balance-input"]}>
                                        <span className={`${s.bi} bi-coin`}></span>
                                        <input id={s.balance} type="number" name="balance" required value={moti_accountBalance} onChange={(e) => setMoti_accountBalance(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className={s.viewValue}>
                                    <span>Total Balance :</span>
                                    <p>$ {accounts.find(account => account.id === moti_accountId).totalBalance}</p>
                                </div>
                                <div className={`${s.viewValue} ${s.green}`}>
                                    <span>Total Incomes :</span>
                                    <p>$ {accounts.find(account => account.id === moti_accountId).incomes}</p>
                                </div>
                                <div className={`${s.viewValue} ${s.red}`}>
                                    <span>Total Expenses :</span>
                                    <p>$ {accounts.find(account => account.id === moti_accountId).expenses}</p>
                                </div>
                                {accounts.length > 1 &&
                                    <div className={s.option} onClick={() => setOpenDelete(true)}>
                                        <div>
                                            <i className={`${s.bi} bi-trash-fill`}></i>
                                            <p>Delete Account</p>
                                        </div>
                                        <i className={`${s.bi} bi-chevron-right`}></i>
                                    </div>
                                }
                                <button type="submit" className={s.btn1}>Save</button>
                            </form>
                        </div>
                    </div>
                }

                {openDelete &&
                    <div className={s.wrapper}>
                        <div className={s["delete-account"]}>
                            <div className={s.close}>
                                <i className={`${s.bi} bi-x`} onClick={() => setOpenDelete(false)}></i>
                            </div>
                            <div className={s.content}>
                                <p>Are You Sure you want to delete this account?</p>
                                <span>All incomes and expenses relevant to this account will be deleted. </span>
                            </div>
                            <button className={s.btn1} onClick={DeleteAccount}>Delete</button>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

export default Accounts;
