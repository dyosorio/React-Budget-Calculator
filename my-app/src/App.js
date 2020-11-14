import './App.css';
import React,{ useState,useEffect } from 'react';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { Alert } from './components/Alert';
import {v4 as uuid} from "uuid"; 

/*
const initialExpenses = [ 
  { id:uuid(), charge:'rent',  amount:1200 },
  { id:uuid(), charge:'car payment',  amount:600 },
  { id:uuid(), charge:'credit card bill',  amount:100 }
];
*/

const initialExpenses = localStorage.getItem('expenses')? JSON.parse(localStorage.getItem('expenses')): [];



function App() {
  //************** state values **************
  //all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  //single expense
  const [charge, setCharge] = useState('');
  //single amount
    const [amount, setAmount] = useState('');
  //alert
    const [alert, setAlert] = useState({ show:false });
  //edit
    const [edit, setEdit] = useState(false);
  //edit item
    const [id, setId] = useState(0);
  //************** useEffect **************
  useEffect(()=>{
    localStorage.setItem('expenses', JSON.stringify(expenses), [expenses]);
  });
  //************** functionality **************
  const handleCharge = e => {
    setCharge(e.target.value);
  };
  const handleAmount = e => {
    setAmount(e.target.value);
  };
  //handle Alert
  const handleAlert = ({type,text}) => {
    setAlert({ show:true,type,text });
    setTimeout(() => {
       setAlert({show:false})
    }, 3000)
  }
  //handle Submit
  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id?{...item,charge,amount} :item
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({type:'success', text:'item edited'});
      } else {
        const singleExpense = { id:uuid(),charge,amount };
        setExpenses([...expenses,singleExpense]);
        handleAlert({type:'success', text:'item added'});
      }
      setCharge('');
      setAmount('');
    } else {
      //handle alert called
      handleAlert({ 
        type:'danger', 
        text:`charge can't be empty value and amount value has to be bigger than zero`
       });
    }
  };  
  //clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type:'danger', text:'all items deleted'});
  }
  //handle delete single item
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item =>  item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type:'danger', text:'item deleted'});
  };
  //handle edit 
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id);
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }; 

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget calculator</h1>
      <main className='App'>
        <ExpenseForm 
        handleSubmit={handleSubmit} 
        charge={charge} 
        handleCharge={handleCharge} 
        amount={amount} 
        handleAmount={handleAmount}
        edit={edit} 
        />
        <ExpenseList expenses={expenses} 
        handleDelete={handleDelete} 
        handleEdit={handleEdit}
        clearItems={clearItems}  
        />
      </main>
      <h1>
        total spending : <span className='total'>
          ${expenses.reduce((acc, curr)=>{
            return (acc += parseInt(curr.amount));
          },0)}
        </span>
      </h1>
    </>
  );
}

export default App;
