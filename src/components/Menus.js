import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Menus = ({ menu, masukKeranjang }) => {
  return (
                <Col md={6} lg={4} key={menu.id} className="mb-3">
                  <Card className="product-card">
                    <Card.Img variant="top" src={`assets/images/${menu.category.nama.toLowerCase() + "/" + menu.gambar}`} />
                    <Card.Body>
                      <Card.Title>{menu.nama} <strong>({menu.kode})</strong></Card.Title>
                      <Card.Text>
                        Rp {menu.harga.toLocaleString('id-ID')}
                      </Card.Text>
                      <Button variant="outline-primary" size="sm" className="w-100" onClick={() => masukKeranjang(menu)}>
                        + Tambah ke Keranjang
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
  );
};

export default Menus;