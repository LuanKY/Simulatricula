declare module 'lucide-react' {
    import * as React from 'react';

    export interface LucideProps extends React.SVGProps<SVGSVGElement> {
        color?: string;
        size?: string | number;
        absoluteStrokeWidth?: boolean;
    }

    export type LucideIcon = (props: LucideProps) => JSX.Element;

    export const Download: LucideIcon;
    export const Save: LucideIcon;
    export const Trash2: LucideIcon;
    export const Upload: LucideIcon;
    export const X: LucideIcon;
    export const AlertCircle: LucideIcon;
    export const Moon: LucideIcon;
    export const Sun: LucideIcon;
}
