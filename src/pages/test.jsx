import { useState } from "react";
import { useFetchAuth } from "../components/fetchAuth";

function Test() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com';
    const [preview, setPreview] = useState(null);
    const fetchAuth = useFetchAuth();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const rs = await fetchAuth(`${API_BASE}/api/user/uploadProfile`, {
                method: "POST",
                body: formData,
                headers: {}
            });

            console.log(rs);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Test Page</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Profile_Preview" />}
        </div>
    );
}

export default Test;
