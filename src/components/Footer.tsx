import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
    return (
      <footer style={styles.footer}>
        <p>
        <GitHubIcon fontSize="small" />{' '}
          <a href="https://github.com/HIPReader/HIPReader" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </p>
        <p>Team Members: 김기홍, 봉수현, 신기환, 이지은, 전영환</p>
      </footer>
    );
  }
  
  const styles = {
    footer: {
      textAlign: 'center' as const,
      padding: '20px',
      borderTop: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      fontSize: '14px',
      color: '#333',
    },
  };