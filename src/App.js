import React, { useState, useEffect } from "react";
import "./App.css";
import Alert from "./components/Alert";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import uuid from "uuid/v4";

//local storage
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

// const initialExpenses = [
//   {
//     id: uuid(),
//     charge: "rent",
//     amount: 1500
//   },
//   {
//     id: uuid(),
//     charge: "car",
//     amount: 400
//   },
//   {
//     id: uuid(),
//     charge: "books",
//     amount: 100
//   }
// ];

function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({ show: false });
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleCharge = e => {
    setCharge(e.target.value);
  };

  const handleAmount = e => {
    setAmount(e.target.value);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let temp = expenses.map(item => {
          return item.id === editId ? { ...item, charge, amount } : item;
        });
        setExpenses(temp);
        setEdit(false);
        handleAlert({ type: "success", text: "Item edited" });
      } else {
        const expense = { id: uuid(), charge, amount };
        setExpenses([...expenses, expense]);
        handleAlert({ type: "success", text: "Item added" });
      }
      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `Charge can't be empty value and amount value has to be bigger than zero`
      });
    }
  };

  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All item deleted" });
  };

  const handleDelete = id => {
    setExpenses(expenses.filter(x => x.id !== id));
    handleAlert({ type: "danger", text: "Item deleted" });
  };

  const handleEdit = id => {
    let expense = expenses.find(x => x.id === id);
    setCharge(expense.charge);
    setAmount(expense.amount);
    setEdit(true);
    setEditId(id);
    console.log(expense);
  };

  return (
    <>
      {alert.show ? <Alert type={alert.type} text={alert.text} /> : null}
      <h1>Budget Calculator</h1>
      <main className='App'>
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          clearItems={clearItems}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        Total Spending:{" "}
        <span className='total'>
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
