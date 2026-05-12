import React from 'react'
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap'
import { FaMinus, FaPlus, FaTrash, FaSave, FaTimes, FaShoppingCart } from 'react-icons/fa';

const ModalKeranjang = ({ showModal, 
                          handleClose,
                          keranjangDetail,
                          tambah,
                          kurang,
                          keterangan,
                          onKeteranganChange,
                          handleSave,
                          handleDelete }) => {
    
    if (!keranjangDetail) {
        return null;
    }
    
    return (
        <Modal show={showModal} onHide={handleClose} centered size="md">
            <Modal.Header closeButton className="bg-primary text-white" style={{ backgroundColor: '#22668A' }}>
                <Modal.Title className="d-flex align-items-center gap-2">
                    <FaShoppingCart />
                    <span>
                        {keranjangDetail.product?.nama}
                        <small className="d-block text-white-50 fs-6">
                            Rp {keranjangDetail.product?.harga?.toLocaleString('id-ID')}
                        </small>
                    </span>
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="p-4">
                {/* Informasi Harga */}
                <div className="bg-light p-3 rounded-3 mb-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Harga Satuan:</span>
                        <strong>Rp {keranjangDetail.product?.harga?.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="text-muted">Total Harga:</span>
                        <strong className="text-primary fs-5">
                            Rp {((keranjangDetail.jumlah || 0) * (keranjangDetail.product?.harga || 0)).toLocaleString('id-ID')}
                        </strong>
                    </div>
                </div>
                
                {/* Jumlah Pesanan */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold mb-3">
                        <FaPlus className="me-1" /> Jumlah Pesanan
                    </Form.Label>
                    <InputGroup className="justify-content-center">
                        <Button 
                            variant="outline-danger" 
                            size="lg"
                            onClick={kurang}
                            disabled={keranjangDetail.jumlah <= 1}
                            className="rounded-start-pill"
                        >
                            <FaMinus />
                        </Button>
                        <Form.Control 
                            type="number" 
                            value={keranjangDetail.jumlah}
                            readOnly
                            className="text-center fw-bold fs-4"
                            style={{ maxWidth: '100px' }}
                        />
                        <Button 
                            variant="outline-success" 
                            size="lg"
                            onClick={tambah}
                            className="rounded-end-pill"
                        >
                            <FaPlus />
                        </Button>
                    </InputGroup>
                    <Form.Text className="text-muted d-block text-center mt-2">
                        Minimal pemesanan 1 item
                    </Form.Text>
                </Form.Group>
                
                {/* Keterangan */}
                <Form.Group className="mb-4">
                    <Form.Label className="fw-bold mb-3">
                        <FaSave className="me-1" /> Keterangan
                    </Form.Label>   
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Tambahkan keterangan untuk pesanan ini (opsional)"
                        value={keterangan || ""}
                        onChange={onKeteranganChange}
                    />
                </Form.Group>
            </Modal.Body>
            
            <Modal.Footer className="bg-light">
                <Button 
                    variant="secondary" 
                    onClick={handleClose}
                    className="d-flex align-items-center gap-2"
                >
                    <FaTimes /> Batal
                </Button>
                <Button 
                    variant="danger" 
                    onClick={handleDelete}
                    className="d-flex align-items-center gap-2"
                >
                    <FaTrash /> Hapus Pesanan
                </Button>
                
                <Button 
                    variant="primary" 
                    onClick={handleSave}
                    className="d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#22668A', border: 'none' }}
                >
                    <FaSave /> Simpan Perubahan
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalKeranjang