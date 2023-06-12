import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
//ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button, CardActionArea, CardActions } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
//components
import AddedAlert from '../alerts/addedAlert';


export default function ProductTemplate({ productName, productData, cartFunctions }) {
    const products = productData
    products.sort((a, b) => b.variant-a.variant)
    const [product, setProduct] = useState(products[0])
    const [isProductPage, setIsProductPage] = useState(false)
    const [openImage, setOpenImage] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        let param = new URLSearchParams(location.search)
        const ID = param.get('id')
        products.forEach(product => {
            if (ID === product.id) setIsProductPage(true)
        })
    }, [location, products])

    return (
        <Grid item xs>
            <Card elevation={5} sx={{ maxWidth: 600, minWidth: 300, height: '100%' }}>

                <Box
                    style={{ display: imageLoading ? "block" : "none" }}
                    sx={{ height: isProductPage ? 300 : 170 }}>
                    <CircularProgress
                        sx={{ position: 'relative', top: '50%', left: '45%', transform: 'translate(-50%, -50%)' }} />
                </Box>

                <ProductActionArea />
                <CardActions>
                    {CreateVariantSelector(products)}
                    &nbsp;&nbsp;
                    {CreateAddButton(product)}
                </CardActions>
            </Card>
        </Grid>
    );

    function ProductActionArea() {
        if (isProductPage) return (
            <div>
                <CardActionArea onClick={() => setOpenImage(true)} >
                    <CardMedia
                        style={{ display: imageLoading ? "none" : "block" }}
                        component="img"
                        height="300"
                        image={product.images[0]}
                        onLoad={() => { setImageLoading(false) }}
                        alt={productName}>
                    </CardMedia>
                </CardActionArea>
                <OpenImage />
                <ProductContent />
            </div>
        )

        return (
            <CardActionArea component={Link} to={location.pathname + '?id=' + product.id} >
                <CardMedia
                    style={{ display: imageLoading ? "none" : "block" }}
                    component="img"
                    height="170"
                    image={product.images[0]}
                    onLoad={() => { setImageLoading(false) }}
                    alt={productName}>
                </CardMedia>
                <ProductContent />
            </CardActionArea>
        );
    }

    function ProductContent() {
        let description = product.metadata.description || product.description
        if (description.length > 50 && !isProductPage) description = description.substring(0, 50) + '...'
        return (
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {productName} - {(product.unit_amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        );
    }

    function CreateVariantSelector(products) {

        if (products.length > 1) return createVariantMenuandButton(products)

        function createVariantMenuandButton(products) {
            return (
                <FormControl >
                    <InputLabel id="demo-simple-select-label">{product.variant_title}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={product.variant}
                        label={product.variant_title}
                    >
                        {products.map(block => createVariant(block))}
                    </Select>
                </FormControl>

            );
        }

        function createVariant(newProduct) {
            return (
                <MenuItem key={newProduct.default_price} value={newProduct.variant} onClick={() => {
                    setProduct(newProduct)
                    setImageLoading(true)
                }}>{newProduct.variant}</MenuItem>
            );
        }
    }

    function CreateAddButton(product) {
        const [open, setOpen] = useState(false);
        const handleClickOpen = () => {
            setOpen(true);
        };
        return (
            <Stack>
                <Button size='large' startIcon={<AddShoppingCartIcon />} onClick={() => {
                    cartFunctions.addCartItem({
                        id: product.id,
                        price: product.default_price,
                        unit_amount: product.unit_amount,
                        name: product.name,
                        img: product.images[0]
                    })

                    handleClickOpen();
                }} variant="contained" disableElevation>Add to cart</Button>
                <AddedAlert open={open} setOpen={setOpen} product={product} />
            </Stack>
        );
    }

    function OpenImage() {
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            boxShadow: 24,
            p: 0,
        };
        return (
            <Modal
                sx={{ 'line-height': 0 }}
                disableAutoFocus
                open={openImage}
                onClose={() => setOpenImage(false)}
                onClick={() => setOpenImage(false)}
            >
                <Box sx={style}>
                    <img src={product.images[0]} alt={productName} style={{ maxWidth: "100%", 'border-radius': 5 }} />
                </Box>
            </Modal>
        )
    }
}

