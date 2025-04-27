import React from 'react';

export default function Home() {
  return (
    <div>
      {/* 배경 이미지 섹션 */}
      <div style={styles.wallpaper}>
        <div style={styles.overlay}>
          <img src="/logo.png" alt="로고" style={styles.bigLogo} />
          <p style={styles.description}>
            저희 <strong>힙한리더</strong>는 <code>text-hip</code>에서 영감을 받아 만든 애플리케이션으로<br />
            ~~~한 기능을 지닌 웹입니다
          </p>
        </div>
      </div>

      {/* 자유 게시판 */}
      <section style={styles.section}>자유 게시판</section>
    </div>
  );
}

const styles = {
  wallpaper: {
    backgroundImage: 'url("/book_wallpaper.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    padding: '20px 30px',
  },
  bigLogo: {
    height: '300px',
    objectFit: 'contain' as const,
  },
  description: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.5',
  },
  section: {
    border: '1px solid #000',
    padding: '40px',
    margin: '16px',
    textAlign: 'center' as const,
    backgroundColor: '#fdfdfd',
  },
};