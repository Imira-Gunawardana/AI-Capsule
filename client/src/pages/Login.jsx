function Login() {
  const handleLogin = () => {
    const apiUrl =
      window.location.hostname === "localhost"
        ? "https://ai-capsule-why1.onrender.com"
        : "";

    window.location.href = `${apiUrl}/auth/github`;
  };

  return (
    <div className="login-page">
      <h1>Login to AI Capsule</h1>

      <p>
        Sign in securely using your GitHub account.
      </p>

      <button onClick={handleLogin}>
        Continue with GitHub
      </button>
    </div>
  );
}

export default Login;
