import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Modal as MantineModal, 
  TextInput, 
  NumberInput, 
  Textarea, 
  Button, 
  Group,
  Title,
  Stack,
  ActionIcon
} from "@mantine/core";

import dayjs from 'dayjs';
import { DateInput } from '@mantine/dates';
import { BACKNED_URL } from "../../config";
import axios from "axios";
import CancelIcons from "../Icon/CancelIcons";


export const AddContentModal = ({ opened, onClose, setMessage }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(null);
    const [price, setPrice] = useState(null);
    const [comment, setComment] = useState("");
    const [date, setDate] = useState(null);

    const dateParser = (input) => {
        if (input === 'WW2') {
          return new Date(1939, 8, 1);
        }
      
        return dayjs(input, 'DD/MM/YYYY').toDate();
      };


  const addContent = async () => {
    setLoading(true)
    console.log("Name:", name);
    console.log("Quantity:", quantity);
    console.log("Price:", price);
    console.log("Comment:", comment);
    console.log("Date:", date ? dayjs(date).format("DD/MM/YYYY") : "No date selected");
    let response = "";
    try{
        const token = localStorage.getItem("authorization");
        if (token) {
            response = await axios.post(`${BACKNED_URL}/api/v1/expirey/create`,{
                name,
                quantity,
                price,
                comment,
                date : dayjs(date).format("DD/MM/YYYY")
            }, {
                headers: { Authorization: token },
            })
            if(response.data){
                setMessage({ text: response.data.message, id: Date.now() });
                console.log(response.data)
                if(response.data.success){
                    setTimeout(() => {
                        navigate("/dashboard")
                    }, 1000) // Redirect if token is valid
                }
            }
        }
        else{
            setMessage({ text: response.data.message, id: Date.now() });
            localStorage.removeItem("autorization");
            navigate("/signin")
        }
    } catch(e) {
        console.log(e.meesage)
        setMessage({ text: e, id: Date.now() });

    } finally{

        setLoading(false)
        setName("");
        setQuantity(1);
        setComment("")
        setPrice(null)
        setDate(null)
        onClose()
        setTimeout(() => {
            navigate("/dashboard")
        }, 1000)
    }

  };



  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={<span order={3}>Add New Entry</span>}
      centered
      overlayProps={{
        color: "#000",
        opacity: 0.65,
        blur: 3
      }}
      withCloseButton={true}
      closeButtonProps={{
        icon: <CancelIcons />
      }}
      size="md"
      radius="md"
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        addContent();
      }}>
        <Stack spacing="md">
          <TextInput
            label="Name"
            placeholder="Enter item name"
            required
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <NumberInput  
            value={quantity}
            onChange={setQuantity}
            label="Quantity"
            min={1}
            placeholder="Enter quantity"
            required
            withAsterisk
          />

          <NumberInput
            value={price}
            onChange={setPrice}
            label="Price"
            defaultValue={0}
            min={0}
            precision={2}
            placeholder="Enter price"
            required
            withAsterisk
            icon="$"
          />

            <DateInput
                dateParser={dateParser}
                valueFormat="DD/MM/YYYY"
                label="Used By"
                placeholder="Used By"
                value={date}
                required
                onChange={setDate}
            />
            {/* <DateInput
                label="Date"
                placeholder="Type WW2 or pick a date"
                icon={<IconCalendar size={16} />}

                valueFormat="DD/MM/YYYY"
          /> */}

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            label="Comment"
            placeholder="Optional notes about this entry"
            autosize
            minRows={2}
            maxRows={4}
          />

          <Group position="right" mt="md">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="green" 
              loading={loading}
            >
              Add Entry
            </Button>
          </Group>
        </Stack>
      </form>
    </MantineModal>
  );
};