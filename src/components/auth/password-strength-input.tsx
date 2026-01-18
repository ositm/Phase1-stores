"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
}

export function PasswordStrengthInput({ id, label = "Password", className, ...props }: PasswordStrengthInputProps) {
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState(false);

    const requirements = [
        { label: "At least 12 characters", valid: password.length >= 12 },
        { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Contains number", valid: /[0-9]/.test(password) },
        { label: "Contains special character", valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const validCount = requirements.filter((r) => r.valid).length;
    const strengthScore = (validCount / requirements.length) * 100;

    const getStrengthColor = (score: number) => {
        if (score <= 20) return "bg-red-500";
        if (score <= 60) return "bg-yellow-500";
        if (score < 100) return "bg-blue-500";
        return "bg-green-500";
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (props.onChange) props.onChange(e);
                }}
                onBlur={(e) => {
                    setTouched(true);
                    if (props.onBlur) props.onBlur(e);
                }}
                className={cn(
                    touched && validCount < 5 ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                {...props}
            />

            <div className="space-y-2" aria-live="polite">
                <Progress
                    value={strengthScore}
                    className={cn("h-1.5", getStrengthColor(strengthScore))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs text-muted-foreground">
                    {requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            {req.valid ? (
                                <Check className="h-3 w-3 text-green-500" />
                            ) : (
                                <X className="h-3 w-3 text-red-500" />
                            )}
                            <span className={cn(req.valid ? "text-foreground" : "")}>
                                {req.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
