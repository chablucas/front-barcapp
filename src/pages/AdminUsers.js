import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API}/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Erreur");

                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, []);

    const promoteUser = async (id) => {
        try {
            const res = await fetch(`${API}/user/${id}/promote`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(users.map(u => u._id === id ? data.user : u));
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleBlock = async (id) => {
        try {
            const res = await fetch(`${API}/user/${id}/block`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(users.map(u => u._id === id ? data.user : u));
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Confirmer la suppression de cet utilisateur ?")) return;
        try {
            const res = await fetch(`${API}/user/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Utilisateurs inscrits</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Bloqué</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isBlocked ? 'Oui' : 'Non'}</td>
                            <td>
                                {user.role !== 'admin' && (
                                    <button onClick={() => promoteUser(user._id)}>🆙 Promouvoir</button>
                                )}
                                <button onClick={() => toggleBlock(user._id)} style={{ marginLeft: 8 }}>
                                    {user.isBlocked ? '✅ Débloquer' : '🚫 Bloquer'}
                                </button>
                                <button onClick={() => deleteUser(user._id)} style={{ marginLeft: 8 }}>
                                    🗑 Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
