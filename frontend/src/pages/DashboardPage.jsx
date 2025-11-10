import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const DashboardPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [editOpen, setEditOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [saving, setSaving] = useState(false);
    // Add-product state
    const [addOpen, setAddOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '', stock_quantity: 0 });
    const [adding, setAdding] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_BASE}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data.products || []);
            console.log('Fetched products:', res.data.products?.length || 0);
        } catch (err) {
            console.error('Error fetching products:', err?.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await axios.delete(`${API_BASE}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(prev => prev.filter(p => p._id !== id));
            console.log('Deleted product', id);
        } catch (err) {
            console.error('Delete failed:', err?.response?.data || err.message);
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const openEdit = (product) => {
        setCurrent({ ...product });
        setEditOpen(true);
    };

    const handleSave = async () => {
        if (!current) return;
        setSaving(true);
        try {
            const payload = {
                name: current.name,
                price: current.price,
                description: current.description,
                stock_quantity: current.stock_quantity
            };
            const res = await axios.put(`${API_BASE}/api/products/${current._id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // update local list
            setProducts(prev => prev.map(p => p._id === current._id ? res.data.product || current : p));
            setEditOpen(false);
            console.log('Product updated', current._id);
        } catch (err) {
            console.error('Update failed:', err?.response?.data || err.message);
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const openAdd = () => {
        setNewProduct({ name: '', price: 0, description: '', stock_quantity: 0 });
        setAddOpen(true);
    };

    const handleAddSave = async () => {
        setAdding(true);
        try {
            const payload = { ...newProduct };
            const res = await axios.post(`${API_BASE}/api/products`, payload, { headers: { Authorization: `Bearer ${token}` } });
            const created = res.data.product || res.data;
            setProducts(prev => [created, ...prev]);
            setAddOpen(false);
            console.log('Product created', created._id || created.id);
        } catch (err) {
            console.error('Create failed:', err?.response?.data || err.message);
            alert(err.response?.data?.message || 'Create failed');
        } finally {
            setAdding(false);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Products</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="contained" onClick={openAdd}>Add Product</Button>
                    <Typography variant="body2">Logged: {token ? 'Yes' : 'No'}</Typography>
                </Stack>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((p) => (
                                <TableRow key={p._id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.price}</TableCell>
                                    <TableCell>{p.description}</TableCell>
                                    <TableCell>{p.stock_quantity}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => openEdit(p)} size="small" aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(p._id)} size="small" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    {current && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField label="Name" value={current.name} onChange={(e) => setCurrent(prev => ({ ...prev, name: e.target.value }))} fullWidth />
                            <TextField label="Price" type="number" value={current.price} onChange={(e) => setCurrent(prev => ({ ...prev, price: Number(e.target.value) }))} fullWidth />
                            <TextField label="Stock Quantity" type="number" value={current.stock_quantity} onChange={(e) => setCurrent(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))} fullWidth />
                            <TextField label="Description" value={current.description || ''} onChange={(e) => setCurrent(prev => ({ ...prev, description: e.target.value }))} fullWidth multiline rows={3} />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                </DialogActions>
            </Dialog>

            {/* Add product dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <Stack component="form" spacing={2} sx={{ mt: 1 }} onSubmit={(e) => { e.preventDefault(); handleAddSave(); }}>
                        <TextField label="Name" value={newProduct.name} onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))} fullWidth required />
                        <TextField label="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))} fullWidth required inputProps={{ min: 0, step: '0.01' }} />
                        <TextField label="Stock Quantity" type="number" value={newProduct.stock_quantity} onChange={(e) => setNewProduct(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))} fullWidth required inputProps={{ min: 0, step: '1' }} />
                        <TextField label="Description" value={newProduct.description} onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))} fullWidth multiline rows={3} />
                        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
                            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={adding}>{adding ? 'Adding...' : 'Add'}</Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default DashboardPage;