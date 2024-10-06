import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios
            .get(`${baseUrl}/api/v1/blog/bulk`, {
                headers: { Authorization: `${localStorage.getItem("Authorization")}` },
            })
            .then((response) => {
                setBlogs(response.data.blogs);
                setLoading(false);
            });
    }, []);

    return {
        loading,
        blogs,
    };
};

export const useBlog = ({ id }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState();

    useEffect(() => {
        axios
            .get(`${baseUrl}/api/v1/blog/${id}`, {
                headers: { Authorization: `${localStorage.getItem("Authorization")}` },
            })
            .then((response) => {
                setBlog(response.data.blog);
                setLoading(false);
            });
    }, [id]);

    return {
        loading,
        blog,
    };
};
