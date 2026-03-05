export default function InputSuccess({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-emerald-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}
