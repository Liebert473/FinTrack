import styles from '../css/upload.module.css'
import '../css/bootstrap-icons.css'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

function Upload() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const { from } = useParams();
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([])
    const [categories, setCategories] = useState([])

    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState(1);
    const [account, setAccount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");

    const fetchCategories = async () => {
        const rs = await fetch(
            `${API_BASE}/api/categories`
        ).then((x) => x.json());

        setCategories(rs)
        setCategory(JSON.stringify(rs[0]))
    };

    const fetchAccounts = async () => {
        const rs = await fetch(
            `${API_BASE}/api/accounts`
        ).then((x) => x.json());

        setAccounts(rs)
        setAccount(rs[0].id)
    };

    useEffect(() => {
        fetchCategories()
        fetchAccounts();
    }, []);

    function ChangeType() {
        setType(type === "expense" ? "income" : "expense");
    }

    const handleSubmit = async (e) => {
        fetch(`${API_BASE}/api/transactions`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: crypto.randomUUID(),
                type: type,
                amount: Number(amount),
                account: account,
                date: date,
                category: JSON.parse(category)
            })
        })
    };

    return (
        <>
            <div className={styles.screen}>
                <div className={styles.top}>
                    <span onClick={() => navigate(`/${from || "home"}`)} className={styles.bi + ' bi-arrow-left-short'}></span>
                    <div className={styles.heading}>
                        <h1>Add Transaction</h1>
                    </div>
                </div>
                <div className={styles.body}>
                    <ul className={styles.type}>
                        <li className={type === 'expense' ? styles.selected : ''} onClick={ChangeType}>Expense</li>
                        <li className={type === 'income' ? styles.selected : ''} onClick={ChangeType}>Income</li>
                    </ul>

                    <form onSubmit={handleSubmit} className={styles['input-form']}>

                        <div className={styles.input}>
                            <label htmlFor="account">Select account</label>
                            <div className={styles.select}>
                                <select name="account" id="account" value={account} onChange={(e) => setAccount(e.target.value)} required>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>{account.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.input}>
                            <label htmlFor="balance">Amount</label>
                            <div className={styles['balance-input']}>
                                <span className={styles.bi + ' bi-coin'}></span>
                                <input id={styles.balance} type="number" name="balance" value={amount} onChange={(e) => (setAmount(e.target.value))} min={0.1} step="any" required></input>
                            </div>
                        </div>

                        <div className={styles.input}>
                            <label htmlFor="date">Date</label>
                            <input type="date" name="date" id="date" value={date} onChange={(e) => (setDate(e.target.value))} required></input>
                        </div>

                        <div className={styles.input}>
                            <label htmlFor="category">Select category</label>
                            <div className={styles.select}>
                                <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    {categories.map((category) => (
                                        <option key={category.id} value={JSON.stringify(category)}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className={styles.btn1} type="submit">Save</button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Upload;