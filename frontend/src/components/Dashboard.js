import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import styles from "./dashboard.module.css";
import { Form } from "react-bootstrap";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { logindata, setLoginData } = useContext(LoginContext);
  const [data, setData] = useState(false);
  const [inpval, setInpval] = useState([]);
  const [cate, setCate] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [cart, setCart] = useState([]);

  const addToCart = async (product) => {
    const username = logindata?.ValidUserOne?.fname;
    const { name, price, categories } = product;
    setCart([...cart, { name, price, categories, username }]);
  };

  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const setCat = (e) => {
    const { name, value } = e.target;

    setCate(() => {
      return {
        ...cate,
        [name]: value,
      };
    });
  };

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();

    if (data.status === 401 || !data) {
      history("*");
    } else {
      setLoginData(data);
      history("/dash");
    }
  };

  const CategoryList = async () => {
    const res = await fetch(`/productlist/${cate?.categories}`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.status === 401 || !data) {
      history("*");
    } else {
      setCategoriesData(data);
    }
  };

  const edit = () => {
    setInpval(logindata.ValidUserOne);
    setShow(true);
  };

  const update = async (e) => {
    e.preventDefault();
    const { _id, fname, email, role } = inpval;
    const data = await fetch("/updateUser/" + _id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: fname,
        email: email,
        role: role,
      }),
    });

    const res = await data.json();

    if (res.status === 200) {
      toast.success("Update Successfully done 😊!", {
        position: "top-center",
      });
      setInpval({ ...inpval, fname: "", email: "", role: "" });
      DashboardValid();
      setData(true);
      setShow(false);
    }
  };

  useEffect(() => {
    CategoryList();
    setTimeout(() => {
      DashboardValid();

      setData(true);
    }, 2000);
  }, [cate]);

  const orderRequest = async (e) => {
    e.preventDefault();

    for (let i = 0; i <= cart.length - 1; i++) {
      const data = await fetch("/addcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart[i]),
      });
    }

    toast.success("Cart added Successfull 😃!", {
      position: "top-center",
    });
  };

  return (
    <>
      <div className="container">
        <div className="form_input">
          <label className="mt-5" htmlFor="categories">
            Categories
          </label>
          <Form.Select
            aria-label="Default select example"
            name="categories"
            id="categories"
            value={cate.categories}
            onChange={setCat}
          >
            <option value=""> Select Categories </option>
            <option value="shirt"> Shirt </option>
            <option value="tshirt"> T-Shirt</option>
            <option value="pant"> Pant</option>
          </Form.Select>
        </div>
        {data ? (
          <div className="row">
            {categoriesData?.ProductListByCategory?.map((item, index) => {
              return (
                <div className="col-md-3">
                  <div className={styles.banner}>
                    <Card className={styles.cardTop}>
                      <Card.Img
                        className={styles.cardImg}
                        variant="top"
                        src="./man.png"
                        alt="avtar"
                      />

                      <Card.Body>
                        <Card.Title className="text-center">
                          {item?.categories}
                        </Card.Title>
                        <Card.Text style={{ marginLeft: "42px" }}>
                          <label>
                            <b>Name:</b>
                            <span>&nbsp;{item?.name}</span>
                          </label>
                          <label>
                            <b>Price:</b>
                            <span>&nbsp;{item?.price}</span>
                          </label>
                        </Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => addToCart(item)}
                          className={styles.cardButton}
                        >
                          Add to Cart
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            Loading... &nbsp;
            <CircularProgress />
          </Box>
        )}

        <h2 className="mt-5">Shopping Cart</h2>
        <ul>
          {cart.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
        <button onClick={orderRequest}>Order Request</button>
      </div>

      <Modal show={show}>
        <Modal.Header onClick={handleClose} closeButton>
          <Modal.Title>Update User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.banner}>
            <img
              src="./man.png"
              style={{ width: "100px", marginTop: 20 }}
              alt=""
            />
            <div className="form_input">
              <label htmlFor="fname">
                <b>Name:</b>
              </label>
              &nbsp;
              <input
                type="text"
                className={styles.modalInp}
                onChange={setVal}
                value={inpval.fname}
                name="fname"
                id="fname"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">
                <b>Email:</b>
              </label>
              &nbsp;
              <input
                type="email"
                onChange={setVal}
                value={inpval.email}
                name="email"
                id="email"
                className={styles.modalInp}
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="date">
                <b>D.O.B:</b>
              </label>
              &nbsp;
              <input
                type="date"
                onChange={setVal}
                value={inpval.age}
                name="age"
                id="age"
                className={styles.modalInp}
                style={{
                  width: "11em",
                }}
                placeholder="Enter Your Age"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={update}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
