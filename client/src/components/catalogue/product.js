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
import Skeleton from '@mui/material/Skeleton';
//components
import AddedAlert from '../alerts/addedAlert';


export default function Product({ isSingleProduct, productName, productData, cartFunctions }) {
    const products = productData
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [product, setProduct] = useState(products[0])
    const [isProductPage] = useState(isSingleProduct)
    const [openImage, setOpenImage] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        setIsFirstLoad(true)
    }, [])

    return (
        <Grid item xs>
            <Card elevation={5} sx={{ maxWidth: 600, minWidth: 300, height: '100%' }}>

                {(imageLoading && isFirstLoad) &&
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        height={isProductPage ? 300 : 170} />
                }

                {(imageLoading && !isFirstLoad) &&
                    <CardMedia
                        component="img"
                        height={isProductPage ? 300 : 170}
                        image={products[0].images[0]}
                        alt={productName}>
                    </CardMedia>
                }

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
                        image={products[0].images[0]}
                        onLoad={() => {
                            setImageLoading(false)
                            if (isFirstLoad) setIsFirstLoad(false)
                        }}
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
                    image={products[0].images[0]}
                    onLoad={() => {
                        setImageLoading(false)
                        if (isFirstLoad) setIsFirstLoad(false)
                    }}
                    alt={productName}>
                </CardMedia>
                <ProductContent />
            </CardActionArea>
        );
    }

    function ProductContent() {
        const message = `Fully or partially 3D printed from carbon-fiber reinforced polycarbonate or high density PETG, colour may vary.`
        let description = product.metadata.description
        if (description === 'none' || !description) description = product.description
        if (description.length + message.length > 50 && !isProductPage) description = description.substring(0, 50) + '...'
        return (
            <CardContent>
                <Stack direction="row" spacing={1}>

                <Typography gutterBottom variant="h5" component="div">
                    {productName}
                </Typography>
                <Price />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                
                {isProductPage && <Typography variant="body2" color="text.secondary">
                    <br></br>
                    {message}
                    </Typography>}
            </CardContent>
        );

        function Price() {
            return (
                <Typography  variant="h6">
                   {(product.unit_amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Typography>
            )
        }
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
        product.images = products[0].images
        return (
            <Stack>
                <Button size='large' startIcon={<AddShoppingCartIcon />} onClick={() => {
                    cartFunctions.addCartItem({
                        id: product.id,
                        price: product.default_price,
                        unit_amount: product.unit_amount,
                        name: product.name,
                        img: product.images[0],
                        category_route: location.pathname,
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

