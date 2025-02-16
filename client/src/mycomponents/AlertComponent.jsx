import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import{
    Trash2,
    CircleCheck,
    Pencil,
    CircleUser,
    CirclePlus,
  } from "lucide-react"

const AlertComponent = ({ onConfirm, title, description, status }) => {

    const icon = (() => {
        switch (status) {
          case "1":
            return (<Button variant="outline" size="icon">  
              <CirclePlus className="h-4 w-4" />
            </Button>)
          case "2":
            return (<Button variant="outline" size="icon">  
              <CircleCheck className="h-4 w-4" />
            </Button>)
          case "3":
            return (<Button variant="outline" size="icon" className="hover:bg-blue-600 text-blue-600 hover:text-white">  
              <Pencil className="h-4 w-4" />
            </Button>)
          case "4":
            return (<Button variant="outline" size="icon" className="hover:bg-red-600 text-red-600 hover:text-white">  
              <Trash2 className="h-4 w-4" />
            </Button>)
          default:
            return (<Button variant="outline" size="icon">  
              <CircleUser className="h-4 w-4" />
            </Button>)
        }
      })();

      const alertTitle = status === "4" ? "Delete" : title;
      const alertDescription =
        status === "4"
          ? "Are you sure you want to delete this?"
          : description;

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {icon}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
                {alertTitle } Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
                {alertDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>{alertTitle}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
}

export default AlertComponent;
  