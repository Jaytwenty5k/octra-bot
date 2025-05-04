import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content">
        <h1 className="login-title">Willkommen beim StartIT Bot</h1>
        <button
          className="login-button"
          onClick={() => {
            window.location.href = '/auth/discord';
          }}
        >
          Mit Discord einloggen
        </button>
      </div>
    </div>
  );
};

export default Login;