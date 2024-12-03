"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Stock {
  id: number;
  description: string;
  symbol: string;
  price: number;
  quantity: number;
}

