import React, { useState, useCallback } from 'react';
import { UploadFile, UploadStatus } from '../types';
import { ProcessIcon, TrashIcon } from './icons';

interface Props {
  uploadedFiles: UploadFile[];
  onFilesUploaded: (files: UploadFile[]) => void;
  onProcessFiles: () => void;
  onFileDelete: (fileId: number) => void;
  onClearFiles: () => void;
}

const UploadArea: React.FC<Props> = ({ uploadedFiles, onFilesUploaded, onProcessFiles, onFileDelete, onClearFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((fileList: FileList) => {
    const filePromises = Array.from(fileList)
        .filter(file => file.type === 'text/xml')
        .map((file, index) => {
            return new Promise<UploadFile>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    if (content) {
                        resolve({
                            id: Date.now() + index,
                            name: file.name,
                            type: 'XML',
                            status: UploadStatus.Pending,
                            progress: 100,
                            size: file.size,
                            content: content,
                        });
                    } else {
                        reject(new Error(`File content is empty for ${file.name}`));
                    }
                };
                reader.onerror = (e) => reject(e);
                reader.readAsText(file);
            });
    });

    if (filePromises.length !== fileList.length) {
        alert('Apenas arquivos XML são permitidos.');
    }

    Promise.all(filePromises).then(newFiles => {
        if(newFiles.length > 0) {
            onFilesUploaded(newFiles);
        }
    }).catch(error => {
        console.error("Error reading files:", error);
        alert("Houve um erro ao ler um ou mais arquivos.");
    });
  }, [onFilesUploaded]);


  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reset input to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const getStatusPill = (status: UploadStatus) => {
    switch (status) {
      case UploadStatus.Pending: return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{status}</span>;
      case UploadStatus.Failed: return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{status}</span>;
      case UploadStatus.Processed: return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{status}</span>;
      default: return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filesToProcessCount = uploadedFiles.filter(f => f.status === UploadStatus.Pending).length;

  return (
    <div className="space-y-8">
        <header>
            <h1 className="text-3xl font-bold text-gray-900">Upload de Notas Fiscais</h1>
            <p className="mt-1 text-md text-gray-600">Envie arquivos XML. Eles ficarão salvos aqui até você decidir processá-los ou limpá-los.</p>
        </header>

        <div 
            className={`flex justify-center items-center w-full p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
            onClick={() => document.getElementById('file-upload-input')?.click()}
        >
            <div className="text-center">
                 <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                 </svg>
                <p className="mt-2 text-lg font-medium text-gray-600">Arraste e solte os arquivos XML aqui</p>
                <p className="mt-1 text-sm text-gray-500">ou clique para selecionar</p>
                <input id="file-upload-input" type="file" multiple className="hidden" onChange={onFileSelect} accept="text/xml" />
            </div>
        </div>
        
        {uploadedFiles.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Lote de Arquivos</h2>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={onClearFiles}
                            className="text-sm text-gray-600 hover:text-red-700 font-medium p-2 rounded-md hover:bg-red-50 transition-colors"
                        >
                            Limpar Tudo
                        </button>
                        <button
                          onClick={onProcessFiles}
                          disabled={filesToProcessCount === 0}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          <ProcessIcon />
                          Processar Arquivos ({filesToProcessCount})
                        </button>
                    </div>
                </div>

                <ul className="space-y-3">
                    {uploadedFiles.map(file => (
                        <li key={file.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-200">
                            <div className="flex-1 truncate pr-4">
                                <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                           <div className="w-auto">
                                {getStatusPill(file.status)}
                           </div>
                           <button onClick={() => onFileDelete(file.id)} className="ml-4 p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                             <TrashIcon />
                           </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default UploadArea;