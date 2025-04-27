import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function ReadingBooks() {
    return (
        <div className={"py-5"}>
            <h2 className="fw-bold py-3">읽고 있는 책</h2>

            <Row>
                <Col>
                    <Card style={{ width: '18rem' }}>
                        <Link to="/books/detail" style={{ color: 'black', textDecoration: 'none' }}>
                            <Card.Img variant="top" src="/book_wallpaper.jpg" />
                            <Card.Body>
                                <Card.Title>스위츠 인 슈트</Card.Title>
                                <Card.Text>
                                    이름, 이른꽃<br/>
                                    소설
                                </Card.Text>
                                <ProgressBar variant={"dark"} now={60} />
                            </Card.Body>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ width: '18rem' }}>
                        <Link to="/books/detail" style={{ color: 'black', textDecoration: 'none' }}>
                            <Card.Img variant="top" src="/book_wallpaper.jpg" />
                            <Card.Body>
                                <Card.Title>스위츠 인 슈트</Card.Title>
                                <Card.Text>
                                    이름, 이른꽃<br/>
                                    소설
                                </Card.Text>
                                <ProgressBar variant={"dark"} now={80} />
                            </Card.Body>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ width: '18rem' }}>
                        <Link to="/books/detail" style={{ color: 'black', textDecoration: 'none' }}>
                            <Card.Img variant="top" src="/book_wallpaper.jpg" />
                            <Card.Body>
                                <Card.Title>스위츠 인 슈트</Card.Title>
                                <Card.Text>
                                    이름, 이른꽃<br/>
                                    소설
                                </Card.Text>
                                <ProgressBar variant={"dark"} now={30} />
                            </Card.Body>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ width: '18rem' }}>
                        <Link to="/books/detail" style={{ color: 'black', textDecoration: 'none' }}>
                            <Card.Img variant="top" src="/book_wallpaper.jpg" />
                            <Card.Body>
                                <Card.Title>스위츠 인 슈트</Card.Title>
                                <Card.Text>
                                    이름, 이른꽃<br/>
                                    소설
                                </Card.Text>
                                <ProgressBar variant={"dark"} now={100} />
                            </Card.Body>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

const styles = {

};