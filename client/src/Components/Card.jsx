import React, { useState } from 'react';
import DeleteIcon from '../Icon/DeleteIcon';
import EditIcon from '../Icon/EditIcon';
import { BACKNED_URL } from '../../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NumberInput, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import TickIcons from '../Icon/TickIcons';
import CancelIcons from '../Icon/CancelIcons';
import dayjs from 'dayjs';
import CommentIcons from '../Icon/CommentIcons';

export default function Card({ result, setMessage, setResult }) {
    const navigate = useNavigate();
    const [editItemId, setEditItemId] = useState(null);
    const [disable, setDisable] = useState(false)
    const [editFormData, setEditFormData] = useState({
        name: "",
        price: "",
        quantity: "",
        date: ""
    });

    const isValidFormData = () => {
        const { name, price, quantity, date } = editFormData;
      
        if (!name.trim()) return false;
        if (!price || isNaN(price) || price < 0) return false;
        if (!quantity || isNaN(quantity) || quantity < 1) return false;
        if (!date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
      
        return true;
      };

    const handleSave = async (id) => {
        setDisable(true)
        if (!isValidFormData()) {
            setMessage({ text: "Please fill all fields correctly.", id: Date.now() });
            return;
          }
        console.log("Updated Values:", editFormData);
    

        let response
        try{
            const token = localStorage.getItem("authorization");
            if(!token){
                navigate("/signin")
            }
            response = await axios.put(`${BACKNED_URL}/api/v1/expirey/update/${id}`,editFormData,{
                headers: { Authorization: token },
            })
            if(response.data){
                if(response.data.success){
                    setMessage({ text: "Item Updated", id: Date.now() });
                    const updatedItems = result.map((item) =>
                        item._id === id ? { ...item, ...editFormData } : item
                    );
                
                    // Update frontend display
                    if (typeof setResult === 'function') {
                        setResult(updatedItems);
                    }
                }
            } else{
                setMessage({ text: response.data.message, id: Date.now() });
            }
        } catch(e){
            console.log(e)
            setMessage({ text: e.message, id: Date.now() });

        } finally{
            setDisable(false)
            setEditItemId(null);
        }
        // Exit edit mode
    };
    
    

    function getRemainingDays(dateStr) {
        const [day, month, year] = dateStr.split("/");
        const inputDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();

        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
      
        const timeDiff = inputDate - today;
      
        if (timeDiff < 0) {
          return "Expired";
        }
      
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return `${daysLeft}`
      }
      
    const Delete = async (id) => {
        setDisable(true)
        console.log("objid: ", id)
        let response = ""
        try{
            const token = localStorage.getItem("authorization");
            if (token) {
                response = await axios.delete(`${BACKNED_URL}/api/v1/expirey/delete/${id}`, {
                    headers: { Authorization: token },
                })
                if(response.data){
                    setMessage({ text: response.data.message, id: Date.now() });
                    setTimeout(() => {
                        navigate("/dashboard")
                    }, 1000)
                }
            }
            else{
                localStorage.removeItem("autorization");
                setTimeout(() => {
                        navigate("/signin")
                    }, 1000)
            }
        } catch(e) {
            console.log(e)  

        } finally{
            setDisable(false)
        }
    }

  const headerCellStyle =
    "px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase";
  const rowCellStyle =
    "px-4 py-4 text-gray-800 dark:text-gray-200 text-sm whitespace-normal break-words max-w-xs";

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-xl shadow-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 text-center bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className={headerCellStyle}>Sr No</th>
              <th className={headerCellStyle}>Name</th>
              <th className={headerCellStyle}>Price</th>
              <th className={headerCellStyle}>Quantity</th>
              <th className={headerCellStyle}>Expiry Date</th>
              <th className={headerCellStyle}>Remaining Days</th>
              <th className={headerCellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            
            {result.map((item, index) => (

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                <td className={rowCellStyle}>{index+1}</td>
                <td className={rowCellStyle}>
                    {editItemId === item._id ? (

                        <TextInput
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.currentTarget.value })}
                        placeholder="Enter item name"
                        required
                        withAsterisk
                        classNames={{
                            input: "w-auto text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md",
                          }}
                        />
                    ) : (
                        item.name
                    )}
                </td>
                <td className={rowCellStyle}>
                    {editItemId === item._id ? (
                        <NumberInput
                        value={parseFloat(editFormData.price)}
                        onChange={(value) => setEditFormData({ ...editFormData, price: value })}
                        placeholder="Enter price"
                        required
                        withAsterisk
                        min={0}
                        precision={2}
                        icon="$"
                        classNames={{
                            input: "w-full px-2 py-1 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md",
                          }}
                        />
                    ) : (
                        <> ₹ {item.price} </>
                    )}
                </td>
                <td className={rowCellStyle}>
                    {editItemId === item._id ? (
                        <NumberInput
                        value={parseInt(editFormData.quantity)}
                        onChange={(value) => setEditFormData({ ...editFormData, quantity: value })}
                        placeholder="Enter quantity"
                        required
                        withAsterisk
                        min={1}
                        classNames={{
                            input: "w-full px-2 py-1 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md",
                          }}
                        />
                    ) : (
                        item.quantity
                    )}
                </td>
                <td className={rowCellStyle}>
                    {editItemId === item._id ? (
                        <DateInput
                            valueFormat="DD/MM/YYYY"
                            placeholder="Used By"
                            value={new Date(editFormData.date.split('/').reverse().join('-'))}
                            onChange={(value) => {
                                const formatted = value
                                ? `${String(value.getDate()).padStart(2, '0')}/${String(value.getMonth() + 1).padStart(2, '0')}/${value.getFullYear()}`
                                : "";
                                setEditFormData({ ...editFormData, date: formatted });
                            }}
                            required
                            classNames={{
                                input: "w-full px-2 py-1 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md",
                            }}
                        />
                    ) : (
                        item.date
                    )}
                </td>
                <td className={rowCellStyle}>{getRemainingDays(item.date)}</td>
                <td className={rowCellStyle}>
                    <div className="flex items-center gap-2 text-center justify-evenly">
                        {editItemId === item._id ? (
                            <>
                            <div className="relative group inline-block">
                                <button
                                    onClick={() => handleSave(item._id)}
                                    className={`text-green-500 hover:text-green-700 cursor-pointer ${disable ? "text-green-700" : ""}`}
                                    disabled={disable}
                                >
                                <TickIcons />
                                </button>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Save
                                </div>
                            </div>
                            <div className="relative group inline-block">
                            
                                <button
                                    onClick={() => setEditItemId(null)}
                                    className="text-yellow-500 hover:text-yellow-700 ml-2 cursor-pointer"
                                >
                                <CancelIcons />
                                </button>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Cancel
                                </div>
                            </div>
                            </>
                            ) : (
                            <>
                                <div className="relative group inline-block">
                                    <button className={`text-green-500 hover:text-green-700 cursor-pointer`}>
                                        <CommentIcons />
                                    </button>
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 w-max max-w-[100px] break-words text-center">
                                        Comment : {item.comment}
                                    </div>
                                </div>

                                <div className="relative group inline-block">
                                    <button className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => {
                                        setEditItemId(item._id);
                                        setEditFormData({
                                            name: item.name,
                                            price: item.price,
                                            quantity: item.quantity,
                                            date: item.date
                                        });
                                    }}>
                                    <EditIcon />

                                    </button>
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" 
                                    >
                                        Edit
                                    </div>
                                </div>

                                <div className="relative group inline-block">
                                    <button className={`text-red-500 hover:text-red-700 cursor-pointer ${disable ? "text-red-900" : ""}`} onClick={() => Delete(item._id)} disabled={disable}>
                                        <DeleteIcon />
                                    </button>
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Delete
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                </td>
                </tr>
                
            ))}

          </tbody>
        </table>
        {result.length == 0 ? (<div className='text-center mt-4 mb-4 text-xl'>No Item Found ...</div>) : ""}
      </div>
    </div>
  );
}
