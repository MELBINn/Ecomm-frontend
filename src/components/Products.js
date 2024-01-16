import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Product from "./Product";
import { publicRequest } from "../requestMethods";
import axios from 'axios'

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const Products = ({ cat, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();      // created cancel token
    const token = source.token;                    // getting token from source
    const getProducts = async () => {
      try {
        console.log(cat)
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products`
            : "/products",  {
              cancelToken: token
            }
        );
        setProducts(res.data);
        console.log(res.data)

      } catch (err) {
        console.error("Error fetching data:", err); 
      }

    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter(item =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)

          )
        
        )
     
      );
      
  }, [products, cat, filters]);
 
  useEffect(()=>{
    if((sort==="newest")){
      setFilteredProducts((prev)=>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      )
    } 
    else if((sort==="asc")){
      setFilteredProducts((prev)=>
        [...prev].sort((a, b) => a.price - b.price)
      )
    } else{
      setFilteredProducts((prev)=>
        [...prev].sort((a, b) => b.price - a.price)
      )
    }
  },[sort])

  return (
    <Container>
      {cat 
        ? filteredProducts.map((item) => (<Product item={item} key={item._id} />))
        : products.slice(0, 8).map((item) => (<Product item={item} key={item._id} />))
      }
    </Container>
  );
};

export default Products;
