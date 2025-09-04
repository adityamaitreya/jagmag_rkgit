import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [color, setColor] = useState(value || '#000000');
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setColor(newColor);
      onChange(newColor);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full justify-start text-left font-normal", className)}
        >
          <div className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="color-picker">Select a color</Label>
            <div className="flex gap-2">
              <Input
                id="color-picker"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="h-10 w-10 cursor-pointer overflow-hidden p-0 border-0"
              />
              <Input
                type="text"
                value={color}
                onChange={handleHexChange}
                className="font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
              '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
              '#800000', '#808000', '#008000', '#800080', '#008080',
              '#000080', '#FFA500', '#A52A2A', '#800080', '#008080',
            ].map((presetColor) => (
              <button
                key={presetColor}
                className="h-6 w-6 rounded-md border"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  setColor(presetColor);
                  onChange(presetColor);
                }}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}