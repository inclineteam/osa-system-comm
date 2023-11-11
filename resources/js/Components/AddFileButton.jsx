import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap';
import FileIcon from './FileIcon';
import FileItem from './FileItem';
import axios from 'axios';
import { MultipartHeader } from '@/constants/constants';
import { toast } from 'react-toastify';

const AddFileButton = ({ files, setFiles, submissionBinId, userId, handleViewFile, accept = "*", disableAddingFile = false, removable = true }) => {

    const fileElemRef = useRef();
    const [isUploading, setIsUploading] = useState(false)
    const onAddBtnClicked = () => {
        fileElemRef.current.click();
    }

    const getFileIndex = (file) => {
        for (let i = 0; i < files.length; i++) {
            if (file.uploaded) {
                if (file.id == files[i].id) {
                    return i;
                }
            } else {
                if (file.uri == files[i].uri) {
                    return i;
                }
            }
        }
        return -1;
    }

    const updateFileStatus = (file, uri, status = true) => {
        // get file index
        let index = getFileIndex(file);
        if (index >= 0) {
            // get file at index
            file.uploaded = status
            file.uri = uri;
            // store files array elem
            let filesTemp = [...files];
            // replace with the updated one
            filesTemp[index] = file;
            // set files 
            setFiles(filesTemp)
        }
    }

    const uploadFile = async (file) => {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('submission_bin_id', submissionBinId);
        formData.append('user_id', userId);
        setIsUploading(true)
        const res = await axios.post('/upload-report', formData, { headers: MultipartHeader });
        console.log('res: ', res)
        file.id = res.data?.attachment?.id;

        updateFileStatus(file, res.data.fileUrl);
        setIsUploading(false);
    }

    const onSelectFile = (e) => {
        if (e.target.files.length > 0) {
            let file = e.target.files[0];
            file.uri = URL.createObjectURL(file)
            file.uploaded = false;
            setFiles(files => [file, ...files]);
        }
    }

    const removeFile = (file) => {
        if (file.uploaded) {
            // update file
            file.processing = true;
            let filesTemp = [...files];
            filesTemp[getFileIndex(file)] = file;
            setFiles(filesTemp);

            // delete file
            axios.delete(`/report/${file.id}/attachment`)
                .then(res => {
                    console.log(res)
                    let filesTemp = files.filter((f, index) => f.id !== file.id)
                    setFiles(filesTemp)
                })
                .catch((err) => {
                    toast.error('Something went wrong, please try again!');
                    file.processing = false;
                    let filesTemp = [...files];
                    filesTemp[getFileIndex(file)] = file;
                    setFiles(filesTemp);
                })
        } else {
            let filesTemp = files.filter((f, index) => f.uri !== file.uri)
            setFiles(filesTemp)
        }
    }

    const needToUpload = () => {
        for (let f of files) {
            if (f.uploaded === false) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        const uploadFiles = async () => {
            for (let f of files) {
                uploadFile(f);
            }
        }
        if (needToUpload()) {
            uploadFiles();
        }
    }, [files]);


    return (
        <>
            <input
                type="file"
                className='d-none'
                ref={fileElemRef}
                accept={accept}
                onChange={onSelectFile}
            />
            <div className="mb-3">
                {
                    files && files.map((file, index) => (
                        <div key={index}>
                            <FileItem handleViewFile={handleViewFile} submissionBinId={submissionBinId} removable={removable} handleRemove={removeFile} file={file} />
                        </div>
                    ))
                }
            </div>
            {
                !disableAddingFile && (
                    <Button disabled={isUploading} variant='outline-light' className='border shadow-sm rounded-1 col-12 text-dark' onClick={onAddBtnClicked}>
                        <small><i className='bx bx-plus '></i> Add Work</small>
                    </Button>
                )
            }
        </>
    )
}

export default AddFileButton