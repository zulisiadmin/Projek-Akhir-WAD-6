import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Nav } from "react-bootstrap";

const AccountManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Changes saved!");
    console.log(formData);
  };

  return (
    <Container className="my-5">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="border-end">
          <h6 className="mb-3">Kelola Akun Saya</h6>
          <Nav className="flex-column mb-4">
            <Nav.Link active className="text-danger fw-bold">
              Profil Saya
            </Nav.Link>
            <Nav.Link>Address Book</Nav.Link>
            <Nav.Link>Pilihan Pembayaran</Nav.Link>
          </Nav>

          <h6 className="mb-3">Pesanan Saya</h6>
          <Nav className="flex-column mb-4">
            <Nav.Link>Pengembalian Saya</Nav.Link>
            <Nav.Link>Pembatalan Saya</Nav.Link>
          </Nav>

          <h6 className="mb-3">Daftar Favorit</h6>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold text-danger mb-4">Ubah Profil</h5>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label>Nama Depan</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label>Nama Belakang</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        // disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="address">
                      <Form.Label>Alamat</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Password Changes */}
                <h6 className="fw-bold mt-4">Ubah Password</h6>
                <Form.Group controlId="currentPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password Saat Ini"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="newPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password Baru"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Konfirmasi Password Baru"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" type="button">
                    Batal
                  </Button>
                  <Button variant="danger" type="submit">
                    Simpan Perubahan
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountManagement;

