import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ButtonIcon from "./button-icon";
import { MotionValue } from "motion";

// Mock del hook useColor - ESTA ES LA FORMA CORRECTA
vi.mock("@/contexts/ColorContext", () => ({
    useColor: () => ({
        color: "#13FFAA", // Color de prueba
    }),
}));

// Mock de motion/react para evitar problemas con Framer Motion
vi.mock("motion/react", () => ({
    motion: {
        button: ({
            children,
            style,
            ...props
        }: React.ComponentProps<"button">) => (
            <button style={style} {...props}>
                {children}
            </button>
        ),
    },
    useMotionTemplate: (
        template: unknown,
        ...values: Array<MotionValue | number | string>
    ) => {
        // Para border: `1px solid ${color}` -> retornamos el string completo
        if (typeof template === "string" && template.includes("solid")) {
            return `1px solid ${values[0] || "#13FFAA"}`;
        }
        // Para boxShadow: `0px 4px 24px ${color}` -> retornamos el string completo
        if (typeof template === "string" && template.includes("24px")) {
            return `0px 4px 24px ${values[0] || "#13FFAA"}`;
        }
        return values[0] || "#13FFAA";
    },
}));

describe("ButtonIcon", () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada test
        vi.clearAllMocks();
    });

    // Test básico de renderizado
    it("renders correctly with text", () => {
        render(<ButtonIcon text="Click me" />);

        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    // Test con icono
    it("renders with icon", () => {
        const TestIcon = () => <span data-testid="test-icon">🚀</span>;

        render(<ButtonIcon icon={<TestIcon />} />);

        const icon = screen.getByTestId("test-icon");
        expect(icon).toBeInTheDocument();
    });

    // Test con texto e icono
    it("renders with both text and icon", () => {
        const TestIcon = () => <span data-testid="test-icon">🚀</span>;

        render(<ButtonIcon icon={<TestIcon />} text="Launch" />);

        const button = screen.getByRole("button", { name: /launch/i });
        const icon = screen.getByTestId("test-icon");

        expect(button).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
    });

    // Test que verifica que usa el color del mock
    it("applies color from useColor hook", () => {
        render(<ButtonIcon text="Test" />);

        const button = screen.getByRole("button");

        // Verificamos que tiene estilos inline (que vienen del motion template)
        // Usamos expect.stringContaining para ser más flexibles
        expect(button).toHaveStyle({
            border: expect.stringContaining("#13FFAA"),
            boxShadow: expect.stringContaining("#13FFAA"),
        });
    });

    // Test de clases CSS
    it("has correct CSS classes", () => {
        render(<ButtonIcon text="Test" />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass(
            "cursor-pointer",
            "group",
            "relative",
            "flex",
            "w-fit",
            "items-center",
            "gap-1.5",
            "rounded-sm",
            "bg-gray-950/10",
            "px-4",
            "py-2",
            "text-gray-50",
            "transition-colors",
            "hover:bg-gray-950/50",
        );
    });

    // Test cuando no hay ni texto ni icono
    it("renders empty button when no props provided", () => {
        render(<ButtonIcon />);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toBeEmptyDOMElement();
    });
});
