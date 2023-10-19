import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import styles from "./dashboard.module.css";
import { Table } from "react-bootstrap";

function SellerDashboard() {
  const [categoriesData, setCategoriesData] = useState([]);
  console.log(categoriesData);
  const history = useNavigate();
  const CategoryList = async () => {
    const res = await fetch(`/cartlist`, {
      method: "GET",
    });
    const data = await res.json();
    if (data.status === 401 || !data) {
      history("*");
    } else {
      setCategoriesData(data);
    }
  };

  useEffect(() => {
    CategoryList();
    updateStatus();
  }, [categoriesData]);

  const updateStatus = async (id) => {
    console.log(id);
    const data = await fetch("/updateStatus/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "complete",
      }),
    });

    const res = await data.json();

    if (res.status === 200) {
      toast.success("Update Successfully done 😊!", {
        position: "top-center",
      });
    }
  };

  const updateStatus1 = async (id) => {
    console.log(id);
    const data = await fetch("/updateStatus/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancel",
      }),
    });

    const res = await data.json();

    if (res.status === 200) {
      toast.success("Update Successfully done 😊!", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div className="container">
        <h3 className="mt-5">Product List</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Categories</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {categoriesData?.cartlist?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.name}</td>
                  <td>{item?.price}</td>
                  <td>{item?.categories}</td>
                  <td>{item?.username}</td>
                  <td>
                    <button
                      disabled={item?.status === "complete"}
                      onClick={() => updateStatus(item?._id)}
                      variant="primary"
                      style={{
                        backgroundColor: "skyblue",
                        borderRadius: "15px",
                        margin: "3px",
                      }}
                    >
                      {item?.status === "complete" ? (
                        <>Completed</>
                      ) : (
                        <>complete</>
                      )}
                    </button>
                    <button
                      disabled={item?.status === "cancel"}
                      onClick={() => updateStatus1(item?._id)}
                      variant="primary"
                      style={{
                        backgroundColor: "red",
                        borderRadius: "15px",
                        margin: "3px",
                      }}
                    >
                      {item?.status === "cancel" ? <>Canceled</> : <>Cancel</>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <ToastContainer />
    </>
  );
}

export default SellerDashboard;
