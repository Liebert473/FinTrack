import s from '../css/category.module.css'
import '../css/bootstrap-icons.css'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useFetchAuth } from '../components/fetchAuth';
import { useNotify } from '../NotificationContext';

function Category() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const navigate = useNavigate();

    const fetchAuth = useFetchAuth()
    const { notify } = useNotify()

    const [categories, setCategories] = useState([])
    const [openCategory, setOpenCategory] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [openAdd, setOpenAdd] = useState(false)
    const [categoryName, setCategoryName] = useState("")
    const [openDelete, setOpenDelete] = useState(false)
    const [search, setSearch] = useState("")

    const [addName, setAddName] = useState("")

    const MotifyCategory = async () => {
        await fetchAuth(
            `${API_BASE}/api/categories/${selectedCategory}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: categoryName
                }),
            }
        )

        setOpenCategory(false)
        fetchCategories()
    }

    const DeleteCategory = async () => {
        try {
            const rs = await fetchAuth(
                `${API_BASE}/api/categories/${selectedCategory}`,
                {
                    method: "DELETE"
                }
            )

            notify(rs.message, 'success')
        } catch (err) {
            console.log(err)
        }

        setOpenDelete(false)
        setOpenCategory(false)
        fetchCategories()
    }

    const OpenCategory = (id) => {
        setCategoryName(categories.find((x) => x._id === id).name)
        setOpenCategory(true)
        setSelectedCategory(id)
    }

    const AddCategory = async (e) => {
        e.preventDefault();
        try {
            const rs = await fetchAuth(
                `${API_BASE}/api/categories`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: addName
                    }),
                }
            )

            notify(rs.message, 'success')
        } catch (err) {
            console.log(err)
        }

        setAddName("")
        setOpenAdd(false)
        fetchCategories();
    }

    const fetchCategories = async () => {
        const rs = await fetchAuth(
            `${API_BASE}/api/categories?search=${search}`
        )

        setCategories(rs)
    };

    useEffect(() => {
        fetchCategories();
    }, [search]);

    return (
        <>
            <div className={s.screen}>
                <div className={s.top}>
                    <span onClick={() => navigate("/")} className={`${s.bi} bi-arrow-left-short`}></span>
                    <div className={s.heading}>
                        <h1>Category</h1>
                    </div>
                </div>

                <div className={s.body}>
                    <div className={s.head}>
                        <div className={s.search}>
                            <input id="search" type="search" placeholder="Search category" name="search" value={search} onChange={e => setSearch(e.target.value)}></input>
                            <span className={`${s.bi} bi-search`}></span>
                        </div>
                        <div className={s.add} onClick={() => setOpenAdd(true)}>Add New</div></div>

                    <div className={s["cat-container"]}>
                        {categories.map((x) => (
                            <div className={s.cat} key={x._id} onClick={() => OpenCategory(x._id)}>
                                <p>{x.name}</p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {openAdd &&
                <div className={s.wrapper}>
                    <div className={s["window"]}>
                        <div className={s.close}>
                            <i className={`${s.bi} bi-x`} onClick={() => setOpenAdd(false)}></i>
                        </div>
                        <form className={s["input-form"]} onSubmit={AddCategory}>
                            <div className={s.input}>
                                <label>Category name</label>
                                <input type="text" name="name" required value={addName} onChange={(e) => setAddName(e.target.value)}></input>
                            </div>

                            <button type="submit" className={s.btn1}>Add</button>
                        </form>
                    </div>
                </div>
            }

            {openCategory &&
                <div className={s.wrapper}>
                    <div className={s["window"]}>
                        <div className={s.close}>
                            <i className={`${s.bi} bi-x`} onClick={() => setOpenCategory(false)}></i>
                        </div>
                        <form className={s["input-form"]} onSubmit={MotifyCategory}>
                            <div className={s.input}>
                                <label>Category name</label>
                                <input type="text" name="name" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)}></input>
                            </div>

                            <div className={s.option} onClick={() => setOpenDelete(true)}>
                                <div>
                                    <i className={`${s.bi} bi-trash-fill`}></i>
                                    <p>Delete Category</p>
                                </div>
                                <i className={`${s.bi} bi-chevron-right`}></i>
                            </div>

                            <button type="submit" className={s.btn1}>Save</button>
                        </form>
                    </div>
                </div>
            }

            {openDelete &&
                <div className={s.wrapper}>
                    <div className={s["delete-category"]}>
                        <div className={s.close}>
                            <i className={`${s.bi} bi-x`} onClick={() => setOpenDelete(false)}></i>
                        </div>
                        <div className={s.content}>
                            <p>Are You Sure you want to delete this category?</p>
                            <span>All incomes and expenses relevant to this category will be deleted. </span>
                        </div>
                        <button className={s.btn1} onClick={DeleteCategory}>Delete</button>
                    </div>
                </div>
            }

        </>
    )
}

export default Category;