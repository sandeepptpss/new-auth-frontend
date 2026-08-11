import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async ()=>{
      try {
        const response = await fetch(`http://localhost:8002/api/get-blog/${id}`);
        const result = await response.json();
        console.log("Fetched Data:", result);
        setBlog(result.data);
        const createdAt = new Date(result.data.createdAt);
        const isValidDate = !isNaN(createdAt.getTime());
        if(isValidDate){
          const formatted = createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          setFormattedDate(formatted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
     }
  };
  fetchData();
  }, [id]);
  if (!blog) return <p>Loading...</p>;
  return (
    <div className="portfolio-blog custom-main-blog">
      <div className="portfolio-blog-image">
        <img src={`http://localhost:8002/${blog.image}`} alt={blog.title}/>
      </div>
        <h2>{blog.title}</h2>
        <div className="blog-auther-date">
       <h5>Author: {blog.auther}</h5>
      {formattedDate && <p className="blog-publish-date">{formattedDate}</p>}
       </div>
        <p
           className="blog-description"
          dangerouslySetInnerHTML={{ __html: blog.decription }}
         />
    </div>
  );
};
export default BlogDetails;
