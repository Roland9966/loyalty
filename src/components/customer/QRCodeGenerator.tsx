// src/components/customer/QRCodeGenerator.tsx
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Box, CircularProgress, Typography } from '@mui/material';
import QRCodeService from '../../services/qrcode.service';

interface QRCodeGeneratorProps {
  userId: string;
  shopId: string;
  shopName: string;
  userName: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  userId,
  shopId,
  shopName,
  userName,
  size = 256
}) => {
  const [qrValue, setQrValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  useEffect(() => {
    if (userId && shopId) {
      // Egyedi QR kód tartalom generálása a szolgáltatás segítségével
      const qrData = QRCodeService.generateQRData(userId, shopId);
      const qrValue = QRCodeService.getQRCodeValue(qrData);
      
      setQrValue(qrValue);
      setIsGenerating(false);
    }
  }, [userId, shopId]);

  if (isGenerating) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={size}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        sx={{ 
          display: 'inline-block',
          padding: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 2,
          mb: 2
        }}
      >
        <QRCode
          size={size}
          value={qrValue}
          viewBox={`0 0 ${size} ${size}`}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        Kód ellenőrzése: {shopName} - {userName}
      </Typography>
    </Box>
  );
};

export default QRCodeGenerator;