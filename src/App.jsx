import React from 'react';
import AppRouter from './routes/AppRouter';
import "./App.css"
import "primereact/resources/themes/lara-light-cyan/theme.css";


const App = () => {
    return (
        <div className="main-container">
            <AppRouter />
        </div>
    );
};

export default App;
