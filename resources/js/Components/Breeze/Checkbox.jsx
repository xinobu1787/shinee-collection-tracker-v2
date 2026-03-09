export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border border-solid border-gray-300 text-[var(--base-color)] shadow-sm focus:ring-[var(--base-color)] ' +
                className
            }
        />
    );
}
