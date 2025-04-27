import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    age: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const signupData = {
      email: form.email,
      password: form.password,
      nickname: form.nickname,
      age: parseInt(form.age),
      gender: form.gender,
      role: 'ROLE_USER',
    };

    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      if (res.ok) {
        alert('회원가입 성공!');
        navigate('/login');
      } else {
        const err = await res.json();
        alert(err.message || '회원가입 실패');
      }
    } catch (err) {
      alert('네트워크 오류');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>회원가입</h2>
        <input name="email" placeholder="email" value={form.email} onChange={handleChange} style={styles.input} />
        <input name="password" type="password" placeholder="password" value={form.password} onChange={handleChange} style={styles.input} />
        <input name="confirmPassword" type="password" placeholder="password 확인" value={form.confirmPassword} onChange={handleChange} style={styles.input} />
        <input name="nickname" placeholder="nickname" value={form.nickname} onChange={handleChange} style={styles.input} />
        <input name="age" type="number" placeholder="age" value={form.age} onChange={handleChange} style={styles.input} />

        <div style={styles.genderGroup}>
          <label>
            <input type="radio" name="gender" value="MALE" checked={form.gender === 'MALE'} onChange={handleChange} />
            MALE
          </label>
          <label>
            <input type="radio" name="gender" value="FEMALE" checked={form.gender === 'FEMALE'} onChange={handleChange} />
            FEMALE
          </label>
        </div>

        <button type="submit" style={styles.button}>SIGN UP</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '150px',
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    width: '400px',
    padding: '24px',
    border: '1px solid black',
    textAlign: 'center' as const,
  },
  input: {
    width: '90%',
    padding: '12px',
    marginBottom: '12px',
    fontSize: '16px',
    border: '1px solid black',
  },
  genderGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '12px',
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
};
