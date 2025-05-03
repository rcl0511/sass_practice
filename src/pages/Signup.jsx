// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    regNumber: '',
    company: '',
    owner: '',
    address: '',
    businessType: '',
    category: '',
    certificate: null,
    role: 'hospital',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, certificate: e.target.files[0] });
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key] && key !== 'certificate') newErrors[key] = '필수 입력값입니다';
    });
    if (!form.certificate) newErrors.certificate = '이미지를 업로드해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        
        body: formData,
      });

      if (response.ok) {
        alert('회원가입 완료!');
        navigate('/login');
      } else {
        alert('회원가입 실패');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('오류 발생');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#F8F8F8', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <div style={{ maxWidth: 640, width: '100%', background: 'white', borderRadius: 8, border: '0.8px solid #ECECEC', padding: 32, boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)' }}>
        <h2 style={{ color: '#475BE8', fontSize: 24, fontWeight: '800', marginBottom: 24 }}>회원가입</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: '사업자등록번호', name: 'regNumber', max: 100 },
            { label: '상호', name: 'company', max: 200 },
            { label: '대표자명', name: 'owner', max: 200 },
            { label: '사업장주소', name: 'address', max: 200 },
            { label: '업태', name: 'businessType', max: 100 },
            { label: '종목', name: 'category', max: 200 },
          ].map((field) => (
            <div key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 4 }}>{field.label} [필수]</label>
              <input
                type="text"
                name={field.name}
                maxLength={field.max}
                required
                value={form[field.name]}
                onChange={handleChange}
                style={{ padding: 10, borderRadius: 4, border: '1px solid #D1D5DB' }}
              />
              {errors[field.name] && <span style={{ color: 'red', fontSize: 12 }}>{errors[field.name]}</span>}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 4 }}>사업자등록증 업로드 [필수]</label>
            <input type="file" accept="image/*" required onChange={handleFileChange} />
            {errors.certificate && <span style={{ color: 'red', fontSize: 12 }}>{errors.certificate}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: 4 }}>회원 유형 [필수]</label>
            <div>
              <label style={{ marginRight: 16 }}>
                <input type="radio" name="role" value="hospital" checked={form.role === 'hospital'} onChange={handleChange} /> 병원
              </label>
              <label>
                <input type="radio" name="role" value="vendor" checked={form.role === 'vendor'} onChange={handleChange} /> 도매업체
              </label>
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', marginTop: 12, padding: 12, background: '#475BE8', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold' }}
          >
            회원가입
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          이미 계정이 있으신가요?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#475BE8', fontWeight: 'bold', cursor: 'pointer' }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
