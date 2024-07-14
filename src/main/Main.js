import React, { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import './main.css'

function Main() {

    

    
    const[val,setVal] = useState('')
    const[how,setHow] = useState('')
    const[name,setName] = useState('')
    const[res,setRes] = useState('')
    const[showVal,setShowVal] = useState(false)
    const[showCard,setShowCard] = useState(false)
    const[showRes,setShowRes] = useState(false)
    const[byCard,setByCard] = useState('')
    const[sellCard,setSellCard] = useState('')
    const[nameCard,setNameCard] = useState('')
    const[year,setYear] = useState('')
    const[month,setMonth] = useState('')
    const[day,setDay] = useState('')


    const remCard = useRef()
    const remRes= useRef()
    const remAll= useRef()
    


    // получаем данные с сервера
    useEffect(() => {
        
        fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(data => data.json())
        .then(data => {

            setVal(data.Valute)


            let date = new Date()
            setYear(date.getFullYear())
            setMonth(date.getMonth())
            setDay(date.getDate())
        })
        
     }, []);



    // вычисляем результат в зависимости от продажи\покупки и выбранной валюты
     const calc = (e) =>{
        
        e.preventDefault()
        setShowRes(true)
        if (e.target.elements['rad'].value === 'buy'){
           
           Object.keys(val).map(elem =>{
                if( elem === name){
                    let result = (val[elem].Value.toFixed(2) * how).toFixed(2)
                    setRes(result)
                }
                return res
             })
        }

        else if (e.target.elements['rad'].value === 'sell'){
            Object.keys(val).map(elem =>{
                if( elem === name){
                    let result = ((val[elem].Value.toFixed(2) * how) * 0.9).toFixed(2)
                    setRes(result)
                }
                return res
            })
            
        }
    }

    //  считывание инптута колличества единиц и присвоение стейта

    const chInput =(e) => {
        
        let val = +e.target.value
        setHow(val)
    }


    // функция, при запуске которой открывается справа карточка выбранной валюты (название, цена купить\продать)
    const chName = (e) =>{
       
        if(e.target.value){
            setShowCard(true)
        }
            
        else if(!e.target.value){
            setShowCard(false)
        }
        let name = e.target.value
        setName(name)

        Object.keys(val).map(el => {
            if(name === el) {
                let nameC = val[el].Name
                setNameCard(nameC)
                
                let buC = val[el].Value
                setByCard(buC.toFixed(2))

                let sellC = buC * 0.9
                setSellCard(sellC.toFixed(2))
            }
            return (
                byCard,
                nameCard,
                sellCard
            )
        })

     } 

 


  return (
    <>
    <div className="container info" >
      <h2 className="taxt-h2">Курс валют на {day}.{month+1}.{year} г</h2>

      
      
    </div>

    <div className="container calc">
        <h2 className="taxt-h2">Калькулятор обмена</h2>
        <div className="calc-items">
            <form className="calc-form" onSubmit={calc}>
                <h3 className="calc-h3">Я хочу</h3>
                <div className="items-by-sell">
                    <input type="radio" name = 'rad' value='buy' defaultChecked /><label>Купить</label>
                    <input type="radio" name = 'rad' value='sell'/><label>Продать</label>
                </div>
                <div className="how-name">
                    <input onInput={chInput} placeholder="Введите кол-во ед." type="number" className="inputHow"/>
                    <select onChange={chName} name="select" className="inputSelect">
                        <option value="">Выберите валюту</option>
                        {Object.keys(val).map(elem => {
                    return(
                        <option key={elem} value={elem}>{val[elem].Name}</option>
                        
                    )
                })}
                    </select>
                </div>
                
                <input type="submit"  className="submit_btn" value="Рассчитать" />

                <CSSTransition nodeRef={remRes} in={showRes} classNames='alert' timeout={300} unmountOnExit>
                <div ref={remRes} className="res">
                    <h2 className="res-h2">{res} рублей</h2>
                </div>
                </CSSTransition>
                {/* {res && <div className="res">
                    <h2 className="res-h2">{res} рублей</h2>
                </div> */}

            </form>

            <CSSTransition nodeRef={remCard} in={showCard} classNames='alert' timeout={300} unmountOnExit>
            <div ref={remCard} className="item-card">
                    <h4 className="cur-item-name">{nameCard}</h4>
                    <h5 className="cur-item-by">Купить - {byCard} рублей</h5>
                    <h5 className="cur-item-sell">Продать - {sellCard} рублей</h5>
                </div> 
            </CSSTransition>
            {/* {showCard && 
                <div className="item-card">
                    <h4 className="cur-item-name">{nameCard}</h4>
                    <h5 className="cur-item-by">Купить - {byCard} рублей</h5>
                    <h5 className="cur-item-sell">Продать - {sellCard} рублей</h5>
                </div> 
            } */}
            
        </div>
        
    </div>

    <div className="container info">

    <button className="but_all_val" onClick={() =>{setShowVal(!showVal) }}>{showVal ? 'Скрыть все' : 'Показать все' }</button>
      
    <CSSTransition nodeRef={remAll} in={showVal} classNames='alert' timeout={300} unmountOnExit>
    <div ref={remAll} className="cur">
       <div className="currency-items">
        
       {Object.keys(val).map(elem => {
           
           return(
               <div key={elem} className="cur-item">
                   <h4 className="cur-item-name_all">{val[elem].Name}</h4>
                   <h5 className="cur-item-by_all">Купить - {val[elem].Value.toFixed(2)} рублей</h5>
                   <h5 className="cur-item-sell-all">Продать- {(val[elem].Value.toFixed(2) * 0.9).toFixed(2)} рублей</h5>
               </div>
           )
       })}
       
       </div>
       <button className="but_all_val" onClick={() =>{setShowVal(!showVal) }}>Скрыть все</button>
     </div>
    </CSSTransition>
      {/* {showVal && 

      <div className="cur">
       <div className="currency-items">
        
       {Object.keys(val).map(elem => {
           
           return(
               <div key={elem} className="cur-item">
                   <h4 className="cur-item-name_all">{val[elem].Name}</h4>
                   <h5 className="cur-item-by_all">Купить - {val[elem].Value.toFixed(2)} рублей</h5>
                   <h5 className="cur-item-sell-all">Продать- {(val[elem].Value.toFixed(2) * 0.9).toFixed(2)} рублей</h5>
               </div>
           )
       })}
       
       </div>
       <button className="but_all_val" onClick={() =>{setShowVal(!showVal) }}>Скрыть все</button>
     </div> } */}
     </div>
    </>
  );
}

export default Main;
