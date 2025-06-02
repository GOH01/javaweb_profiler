import React, {
    useState,
    useEffect
} from "react";
import axios from "axios";


const Database = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ 파일 목록 불러오기 (마운트 시)
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("/api/files");
                setFiles(response.data); // API 응답이 배열이어야 함
            } catch (err) {
                console.error("파일 목록 불러오기 실패:", err);
                alert("파일 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    // ✅ 파일 삭제
    const handleDelete = async (fileName) => {
        if (!window.confirm(`${fileName} 파일을 삭제하시겠습니까?`)) return;

        try {
            await axios.delete(`/api/files/${fileName}`);
            setFiles((prevFiles) => prevFiles.filter((f) => f !== fileName));
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    // 스타일 정의
    const styles = {
        container: {
            padding: "20px",
            maxWidth: "800px",
            margin: "100px auto",
            backgroundColor: "#fdfdfd",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
        title: {
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
        },
        list: {
            listStyleType: "none",
            padding: "0",
            margin: "0",
        },
        listItem: {
            backgroundColor: "#fff",
            padding: "15px 20px",
            margin: "60px 0",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
        },
        fileName: {
            color: "#555",
            fontSize: "18px",
            fontWeight: "500",
        },
        icon: {
            fontSize: "20px",
            color: "#f44336",
            marginLeft: "15px",
            cursor: "pointer",
        },
    };

    return ( <
        div style = {
            styles.container
        } >
        <
        h1 style = {
            styles.title
        } > Stored Files < /h1>

        {
            loading ? ( <
                p > 파일 목록을 불러오는 중... < /p>
            ) : files.length === 0 ? ( <
                p > 저장된 파일이 없습니다. < /p>
            ) : ( <
                ul style = {
                    styles.list
                } > {
                    files.map((fileName, index) => ( <
                        li key = {
                            index
                        }
                        style = {
                            styles.listItem
                        }
                        onMouseEnter = {
                            (e) => {
                                e.currentTarget.style.transform = "scale(1.02)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 10px rgba(0, 0, 0, 0.15)";
                            }
                        }
                        onMouseLeave = {
                            (e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow =
                                    "0 2px 5px rgba(0, 0, 0, 0.1)";
                            }
                        } >
                        <
                        span style = {
                            styles.fileName
                        } > {
                            fileName
                        } < /span> <
                        span style = {
                            styles.icon
                        }
                        onClick = {
                            () => handleDelete(fileName)
                        }
                        title = "삭제" >
                        ❌
                        <
                        /span> <
                        /li>
                    ))
                } <
                /ul>
            )
        } <
        /div>
    );
};

export default Database;