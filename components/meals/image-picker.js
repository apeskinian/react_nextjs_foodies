'use client';

import { useEffect, useRef, useState } from 'react';
import classes from './image-picker.module.css'
import Image from 'next/image';

export default function ImagePicker({ label, name, resetSignal }) {
    const [ pickedImage, setPickedImage ] = useState();
    const imageInput = useRef();

    useEffect(() => {
        if (resetSignal) {
            setPickedImage(null);
        }
    }, [resetSignal]);

    function handlePickClick() {
        imageInput.current.click();
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (!file) {
            setPickedImage(null);
            return;
        }
        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPickedImage(fileReader.result)
        };

        fileReader.readAsDataURL(file)
    }

    return (
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {!pickedImage && <p>No image picked yet.</p>}
                    {pickedImage && (
                        <Image
                            src={pickedImage}
                            alt='Image picked by user.'
                            fill
                        />
                    )}
                </div>
                <input
                    className={classes.input}
                    type='file'
                    id={name}
                    accept='image/png, image/jpg'
                    name={name}
                    ref={imageInput}
                    onChange={handleImageChange}
                    required
                />
                <button
                    className={classes.button}
                    type='button'
                    onClick={handlePickClick}
                >
                    Pick an Image
                </button>
            </div>
        </div>
    )
}