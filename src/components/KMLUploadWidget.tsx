import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KMLUploadWidget = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.kml') || file.name.endsWith('.kmz')) {
        setUploadedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.kml') || file.name.endsWith('.kmz')) {
        setUploadedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          KML File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-border/40 hover:border-border/60'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your KML/KMZ file here
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onButtonClick}
              className="mb-2"
            >
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground">
              Supports .kml and .kmz files
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".kml,.kmz"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-operational" />
              <span className="text-sm font-medium text-foreground">{uploadedFile.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KMLUploadWidget;