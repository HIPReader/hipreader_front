import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/v1/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('로그인 성공:', data);
        // TODO: accessToken 저장하고 redirect
      } else {
        const error = await response.json();
        alert(error.message || '로그인 실패');
      }
    } catch (err) {
      alert('네트워크 오류');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>로그인</h2>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          SIGN IN
        </button>
        <Link to="/signup" style={styles.signupLink}>
          회원가입
        </Link>
      </form>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '100px',
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    width: '300px',
    padding: '24px',
    border: '1px solid black',
    textAlign: 'center' as const,
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid black',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  },
  signupLink: {
    display: 'block',
    marginTop: '12px',
    fontSize: '14px',
    color: 'black',
    textDecoration: 'underline',
  },
};