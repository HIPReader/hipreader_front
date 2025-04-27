import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Review from '../components/Review'

export default function BooksDetail() {
    return (
        <Container>
            <div className={"mb-5"} style={styles.bookBox}>
                <div>
                    <Image src="/book_wallpaper.jpg" style={styles.bookImg} rounded />
                </div>
                <div>
                    <Card style={styles.bookCard}>
                        <Card.Body>
                            <Card.Title>상수리나무 아래</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                            <Card.Text className={"py-3"}>
                                <b>작가</b>  김수지<br/>
                                <b>출판사</b>  출판사<br/>
                                <b>카테고리</b>  소설<br/>
                                <b>총 페이지</b>  100<br/>
                                <b>구매처</b>  구매처 링크
                            </Card.Text>
                            <Card.Link href="#">찜하기</Card.Link>
                            {/*<Card.Link href="#"></Card.Link>*/}
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* 리뷰 */}
            <Review />
        </Container>
    );
}

const styles = {
    bookImg: {
        width: '205px',
        height: '295px',
        objectFit: 'cover' as 'cover' | 'contain' | 'fill'
    },
    bookCard: {
        border: 'none'
    },
    bookBox: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'stretch',
        gap:'15px'
    }
}