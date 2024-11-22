import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext';

const NavBar = () => {
    const { user, logout} = useUser();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    // Navegación para administradores
    const AdminNav = () => (
        <div className="flex items-center gap-4">
            <Link 
                to="/risk-manager" 
                className="px-2 py-1 text-sm rounded hover:text-green-300"
            >
                Gestionar Riesgos
            </Link>
            <Link 
                to="/register-company" 
                className="px-2 py-1 text-sm rounded hover:text-green-300"
            >
                Gestionar Empresas
            </Link>
            <Link 
                to="/question-manager" 
                className="px-2 py-1 text-sm rounded hover:text-green-300"
            >
                Gestionar Preguntas
            </Link>
            <p>Hola, {user.name}</p>
            <span className="px-2 py-1 text-sm bg-green-700 rounded">
                Admin
            </span>
            <button 
                onClick={handleLogout}
                className="px-2 py-1 text-sm transition-colors duration-300 rounded bg-green-950 hover:text-green-300"
            >
                Cerrar Sesión
            </button>
        </div>
    );

    // Navegación para usuarios normales
    const UserNav = () => (
        <div className="flex items-center gap-4">
            <p>Hola, {user.name}</p>
            <button 
                onClick={handleLogout}
                className="px-2 py-1 text-sm transition-colors duration-300 rounded bg-green-950 hover:text-green-300"
            >
                Cerrar Sesión
            </button>
        </div>
    );

    return (
        <div className=''>
            <div className="flex items-center justify-between w-full h-16 px-12 text-xl text-white bg-green-900">
                <div className="">
                    <Link to='/'>Gestor de Calidad</Link>
                </div>
                <div className="flex items-center gap-4">
                    {!user ? (
                        <Link 
                            to="/login"
                            className="transition-colors duration-300 hover:text-green-300"
                        >
                            Iniciar Sesión
                        </Link>
                    ) : user.admin === "true" ? (
                        <AdminNav />
                    ) : (
                        <UserNav />
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBar
