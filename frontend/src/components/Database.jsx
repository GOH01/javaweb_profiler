import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Database = ({ setChartData }) => {  // DataContext 대신 props로 받음
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/profile");
                setFiles(response.data);
            } catch (err) {
                console.error("파일 목록 불러오기 실패:", err);
                alert("파일 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    const handleDelete = async (tableName) => {
        if (!window.confirm(`${tableName} 파일을 삭제하시겠습니까?`)) return;

        try {
            await axios.delete(`http://localhost:3001/api/profile/drop/${tableName}`);
            setFiles((prevFiles) => prevFiles.filter((f) => f !== tableName));
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    const handleFileClick = async (tableName) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/profile/${tableName}/data`);
            setChartData(response.data);  // props로 받은 함수 사용
            navigate("/chart");
        } catch (err) {
            console.error("파일 데이터 로딩 실패:", err);
            alert("차트 데이터를 불러오지 못했습니다.");
        }
    };

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
            margin: "10px 0",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer",
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

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Stored Files</h1>

            {loading ? (
                <p>파일 목록을 불러오는 중...</p>
            ) : files.length === 0 ? (
                <p>저장된 파일이 없습니다.</p>
            ) : (
                <ul style={styles.list}>
                    {files.map((tableName, index) => (
                        <li
                            key={index}
                            style={styles.listItem}
                            onClick={() => handleFileClick(tableName)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            <span style={styles.fileName}>{tableName}</span>

                            <span
                                style={styles.icon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(tableName);
                                }}
                                title="삭제"
                            >
                                ❌
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Database;
