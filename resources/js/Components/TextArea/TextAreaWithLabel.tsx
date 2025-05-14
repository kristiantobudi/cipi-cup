import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function TextareaWithLabel() {
    return (
        <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Description</Label>
            <Textarea placeholder="Type your message here." id="message" />
        </div>
    );
}
