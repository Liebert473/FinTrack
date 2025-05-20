import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/profile.jpg";
import s from "../css/home.module.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function Home() {
  const API_BASE = 'https://fintrack-api-easr.onrender.com'
  const navigate = useNavigate();

  //Chart
  const [chData, setChData] = useState([])

  //Transaction Motify
  const [selected, setSelected] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)

  //Transactions
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const days = 5;
  const [dates, setDates] = useState([]);
  const [more, setMore] = useState(true)

  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])

  //Spending
  const [viewAcc, setViewAcc] = useState('')
  const [spending, setSpending] = useState(0)

  const fetchSpending = async () => {
    const rs = await fetch(
      `${API_BASE}/api/totalSum/${new Date().toISOString().slice(0, 7)}?account=${viewAcc}&&type=expense`
    ).then((x) => x.json());

    setSpending(rs)
  }

  useEffect(() => {
    fetchSpending()
  }, [viewAcc])

  useEffect(() => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setViewAcc(accounts[0]._id);
    }
  }, [accounts]);

  const fetchChartData = async () => {
    const rs = await fetch(
      `${API_BASE}/api/statistic?view=daily&&type=expense`
    ).then((x) => x.json());

    setChData(rs)
  }

  const fetchCategories = async () => {
    const rs = await fetch(
      `${API_BASE}/api/categories`
    ).then((x) => x.json());

    setCategories(rs)
  };

  const fetchAccounts = async () => {
    const rs = await fetch(
      `${API_BASE}/api/accounts`
    ).then((x) => x.json());

    setAccounts(rs)
  };

  function addDate(date, days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0]
  }

  const fetchTransactions = async () => {
    const rs = await fetch(
      `${API_BASE}/api/transactions/filter?endDate=${endDate}&days=${days}`
    ).then((x) => x.json());

    setLoading(false)

    setTransactions((prev) => {
      const merged = [...prev, ...rs.transactions];
      const unique = Array.from(
        new Map(merged.map((tx) => [tx._id, tx])).values()
      );

      if (rs.uniqueDates.length > 0) {
        setDates(Array.from(new Set([...dates, ...rs.uniqueDates])));
        setEndDate(addDate(rs.uniqueDates[rs.uniqueDates.length - 1], -1));
      }

      setMore(unique.length < rs.totalDataLength)

      return unique;
    });
  };

  const MotifyTransaction = async () => {
    await fetch(`${API_BASE}/api/transactions/${selected._id}`,
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
    await fetch(`${API_BASE}/api/transactions/${selected._id}`, {
      method: "DELETE",
    });

    setSelected(null);
    setOpenDelete(false);

    fetchTransactions();
    setTransactions(prev => prev.filter(x => x._id != selected._id))
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories()
    fetchAccounts()
    fetchChartData()
  }, []);

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
        <div className={s.cover}></div>

        <div className={s.top}>
          <div className={s.profile}>
            <img src={profile} alt=""></img>
            <p>Hi Liebert!</p>
          </div>
          <i className={s.bi + " bi-bell"}></i>
        </div>

        <div className={s.body}>
          <div className={s.head}>
            <span>This Month's Spending</span>
            <p>$ {spending}</p>
            <div className={s.accChoice}>
              <select value={viewAcc} onChange={e => setViewAcc(e.target.value)}>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={s.content}>
            <div className={s.element} onClick={() => navigate("/category")}>
              <i className={s.bi + " bi-x-diamond-fill"}></i>
              <span>Category</span>
            </div>
            <div className={s.section}>
              <div className={s["set-top"]}>
                <p>Anayltics</p>
                <a href="" onClick={() => navigate('/statistics')}>Show more</a>
              </div>
              <div className={s.chart}>
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

            <div className={s.section}>
              <div className={s["set-top"]}>
                <p>Transaction</p>
                <a onClick={() => navigate("/transactions")}>View all</a>
              </div>
              <div className={s.transactions}>
                {dates.map((date, index) => (
                  <Fragment key={date}>
                    <h1>
                      {date === new Date().toISOString().split("T")[0]
                        ? "Today"
                        : date}
                    </h1>
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
                {more && <p className={s.seeMore} onClick={fetchTransactions}>See More</p>}
              </div>
            </div>
          </div>
        </div>

        <div className={s.buttom}>
          <ul className={s.nav}>
            <li>
              <i className={s.bi + " bi-house-door-fill"}></i>
              <span style={{ fontWeight: 600 }}>Home</span>
            </li>
            <li onClick={() => navigate("/statistics")}>
              <i className={s.bi + " bi-bar-chart"}></i>
              <span>Statistics</span>
            </li>
            <li onClick={() => navigate("/upload/home")}>
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
            <div className={s.contents}>
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

export default Home;
