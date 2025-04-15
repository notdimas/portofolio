"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input"; // Assuming Input is in the same directory

interface KnobProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  label?: string;
  unit?: string;
  valueType?: 'percentage' | 'integer' | 'float';
  decimalPlaces?: number;
  sensitivity?: number;
  className?: string;
  ariaLabel?: string;
  hideValueDisplay?: boolean;
}

const MIN_SENSITIVITY = 0.01;

export function Knob({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 40, // Default size in pixels
  label,
  unit = "",
  valueType = 'integer',
  decimalPlaces = 1,
  sensitivity = 1,
  className,
  ariaLabel = "Knob Control",
  hideValueDisplay = false,
}: KnobProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ y: 0, value: 0 });

  // Clamp value within min/max
  const clamp = (val: number) => Math.min(Math.max(val, min), max);

  // Format value for display
  const formatValue = useCallback((val: number): string => {
    let displayVal: string;
    if (valueType === 'integer' || valueType === 'percentage') {
      displayVal = Math.round(val).toString();
    } else { // float
      displayVal = val.toFixed(decimalPlaces);
    }
    return `${displayVal}${unit}`; // Add unit if provided
  }, [valueType, decimalPlaces, unit]);

  // Calculate rotation degrees (e.g., -135 to +135 degrees for a 270 range)
  const rotationRange = 270;
  const valueRange = max - min;
  const degrees = valueRange === 0 ? 0 : (((clamp(value) - min) / valueRange) * rotationRange) - (rotationRange / 2);

  // --- Edit Mode Logic ---
  const handleDoubleClick = () => {
    // Format initial edit value correctly
    if (valueType === 'integer' || valueType === 'percentage') {
      setEditValue(Math.round(value).toString());
    } else {
      setEditValue(value.toFixed(decimalPlaces));
    }
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const confirmEdit = () => {
    let numericValue = valueType === 'float' ? parseFloat(editValue) : parseInt(editValue, 10);
    if (!isNaN(numericValue)) {
      onChange(clamp(numericValue));
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      confirmEdit();
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  };

  // --- Drag Logic ---
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing) return;
    event.preventDefault();
    dragStartRef.current = { y: event.clientY, value: value };
    setIsDragging(true);
    document.body.style.cursor = 'ns-resize';
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { y: startY, value: startValue } = dragStartRef.current;
    const deltaY = -(event.clientY - startY);
    const effectiveSensitivity = Math.max(MIN_SENSITIVITY, sensitivity);

    // Calculate change based on sensitivity and step
    const change = deltaY * effectiveSensitivity * step;
    let newValue = startValue + change;
    
    // Snap to step if integer type
    if(valueType === 'integer' || valueType === 'percentage') {
        newValue = Math.round(newValue / step) * step;
    }

    onChange(clamp(newValue));

  }, [onChange, clamp, min, max, step, sensitivity, valueType]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  // Cleanup listeners
  useEffect(() => {
    return () => {
      if (isDragging) {
          document.body.style.cursor = 'default';
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none", className)} style={{ width: size, height: size + (label ? 20 : 0) }}>
      {label && <span className="text-xs text-muted-foreground mb-1 absolute -top-4 left-0 right-0 text-center truncate">{label}</span>}
      <div 
        ref={knobRef}
        className="relative rounded-full bg-muted border border-muted-foreground/30 flex items-center justify-center cursor-ns-resize"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title={`Value: ${formatValue(value)} (Drag or double-click)`}
        aria-label={ariaLabel}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
      >
        {/* Indicator Line */}
        <div 
          className="absolute h-1/2 w-0.5 bg-foreground origin-bottom top-0 left-1/2 -translate-x-1/2"
          style={{ transform: `rotate(${degrees}deg)` }}
        ></div>
         {/* Center Dot */}
        <div className="absolute h-1 w-1 bg-foreground/50 rounded-full"></div>
      </div>

      {/* Edit Input Overlay */}
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Input
            ref={inputRef}
            type={valueType === 'integer' || valueType === 'percentage' ? "number" : "text"} // Use text for float to allow decimals easily
            step={valueType === 'float' ? (step / 10) : step} // Smaller step for input maybe?
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={confirmEdit}
            className="h-6 w-[80%] border-primary bg-background/90 text-center text-xs font-mono text-foreground shadow-lg focus-visible:ring-1 focus-visible:ring-offset-0 no-spinners p-1"
          />
        </div>
      )}

      {/* Display Value Below Knob (conditionally) */}
      {!isEditing && !hideValueDisplay && (
          <span className="text-xs text-muted-foreground mt-1 absolute -bottom-4 left-0 right-0 text-center truncate">
              {formatValue(value)}
          </span>
      )}
    </div>
  );
} 