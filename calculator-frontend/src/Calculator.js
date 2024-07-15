import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Calculator.css';

const Calculator = () => {
    const [displayValue, setDisplayValue] = useState('0');
    const [currentValue, setCurrentValue] = useState('');
    const [operator, setOperator] = useState('');
    const [previousValue, setPreviousValue] = useState('');

    const handleButtonClick = (value) => {
        if (value === 'clear') {
            clearDisplay();
        } else if (value === 'pos-neg') {
            toggleSign();
        } else if (value === '%') {
            percentage();
        } else if (value === '/' || value === '*' || value === '-' || value === '+') {
            setOperator(value);
            if (currentValue !== '') {
                setPreviousValue(currentValue);
                setCurrentValue('');
                setDisplayValue((prevDisplay) => prevDisplay + ' ' + value);
            }
        } else if (value === '=') {
            if (currentValue !== '' && previousValue !== '' && operator !== '') {
                calculate();
            } else {
                showErrorAlert('Error: Incomplete expression. Please enter both numbers and an operator.');
            }
        } else {
            
            appendValue(value);
        }
    };

    const clearDisplay = () => {
        setDisplayValue('0');
        setCurrentValue('');
        setOperator('');
        setPreviousValue('');
    };

    const toggleSign = () => {
        setCurrentValue((prevValue) => {
            if (prevValue.startsWith('-')) {
                return prevValue.slice(1);
            } else {
                return '-' + prevValue;
            }
        });
    };

    const percentage = () => {
        setCurrentValue((prevValue) => {
            const floatValue = parseFloat(prevValue);
            return (floatValue / 100).toString();
        });
    };

    const appendValue = (value) => {
        setCurrentValue((prevValue) => {
           
            if (prevValue === '0' && value !== '.') {
                return value.toString(); 
            } else {
                return prevValue + value;
            }
        });

        setDisplayValue((prevDisplay) => {
        
            if (prevDisplay === '0' || operator) {
                return value.toString();
            } else {
                return prevDisplay + value;
            }
        });
    };

    const calculate = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/calculate/', {
                num1: parseFloat(previousValue),
                num2: parseFloat(currentValue),
                operation: operator,
            });

            if (response.data.success) {
                setDisplayValue(response.data.result.toString());
                setCurrentValue(response.data.result.toString());
                setOperator('');
                setPreviousValue('');
            } else {
                showErrorAlert('Error: ' + response.data.error);
            }
        } catch (error) {
            console.error('Calculation error:', error);
            showErrorAlert('Error: Calculation failed. Please try again.');
        }
    };

    const showErrorAlert = (errorMessage) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        });
    };

    return (
        <div className="calculator">
            <div className="calculator__wrap">
                <div className="calculator__display">
                    {displayValue}
                </div>
                <div className="calculator__functions">
                    <button className="top_btn" onClick={() => handleButtonClick('clear')}>AC</button>
                    <button className="top_btn" onClick={() => handleButtonClick('pos-neg')}>+/-</button>
                    <button className="top_btn" onClick={() => handleButtonClick('%')}>%</button>
                    <button className="side_btn" onClick={() => handleButtonClick('/')}>/</button>
                    <button className="num_btn" onClick={() => handleButtonClick('7')}>7</button>
                    <button className="num_btn" onClick={() => handleButtonClick('8')}>8</button>
                    <button className="num_btn" onClick={() => handleButtonClick('9')}>9</button>
                    <button className="side_btn" onClick={() => handleButtonClick('*')}>*</button>
                    <button className="num_btn" onClick={() => handleButtonClick('4')}>4</button>
                    <button className="num_btn" onClick={() => handleButtonClick('5')}>5</button>
                    <button className="num_btn" onClick={() => handleButtonClick('6')}>6</button>
                    <button className="side_btn" onClick={() => handleButtonClick('-')}>-</button>
                    <button className="num_btn" onClick={() => handleButtonClick('1')}>1</button>
                    <button className="num_btn" onClick={() => handleButtonClick('2')}>2</button>
                    <button className="num_btn" onClick={() => handleButtonClick('3')}>3</button>
                    <button className="side_btn" onClick={() => handleButtonClick('+')}>+</button>
                    <button className="zero_button" onClick={() => handleButtonClick('0')}>0</button>
                    <button className="num_btn" onClick={() => handleButtonClick('.')}>.</button>
                    <button className="side_btn" onClick={() => handleButtonClick('=')}>=</button>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
