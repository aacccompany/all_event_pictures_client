import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"

const Nav = () => {
    return (
        <div class="text-red-600 bg-gray-100">
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>New Window</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Share</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Print</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>Cart</MenubarTrigger>
                </MenubarMenu>

                <MenubarMenu>
                    <MenubarTrigger>My Photo</MenubarTrigger>
                </MenubarMenu>
            </Menubar>
        </div>

    )
}

export default Nav