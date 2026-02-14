import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }
        if (!isLogin && !name) {
            setError('Name is required for registration');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const body = isLogin ? { email, password } : { name, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('quickcart_token', data.data.token);
                localStorage.setItem('quickcart_user', JSON.stringify(data.data.user));
                navigate('/');
                window.location.reload();
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Unable to connect. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page page-enter">
            <div className="auth-card">
                <div className="auth-icon">{isLogin ? '👋' : '🚀'}</div>
                <h2>{isLogin ? 'Welcome back!' : 'Create Account'}</h2>
                <p>{isLogin ? 'Login to access your cart & orders' : 'Sign up and start shopping in 10 minutes'}</p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="auth-input-group">
                            <span className="auth-input-prefix">👤</span>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="auth-input-group">
                        <span className="auth-input-prefix">✉️</span>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-input-group">
                        <span className="auth-input-prefix">🔒</span>
                        <input
                            type="password"
                            placeholder="Password (min 6 chars)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#DC2626', fontSize: '13px', marginBottom: '12px', textAlign: 'left' }}>{error}</p>
                    )}

                    <button className="auth-submit-btn" type="submit" disabled={loading}>
                        {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    </span>
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{ fontSize: '14px', color: '#0C831F', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
